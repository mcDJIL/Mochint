import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, Clock, Info, Bed } from 'lucide-react';

const BookingStep3 = () => {
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [treatment, setTreatment] = useState(null);
  const [bookings, setBookings] = useState([]); // Data booking dari API/backend

  useEffect(() => {
    const savedTreatment = sessionStorage.getItem('selectedTreatment');
    if (savedTreatment) {
      setTreatment(JSON.parse(savedTreatment));
    } else {
      navigate('/member/booking/step-2');
    }
    
    // Simulasi fetch data booking dari backend
    // Dalam implementasi nyata, ini akan mengambil data berdasarkan selectedDate
    fetchBookingsForDate();
  }, [navigate]);

  const CLINIC_HOURS = {
    open: 8,    // 08:00
    close: 20   // 20:00
  };
  
  const BEDS_CAPACITY = 3;
  const TREATMENT_DURATION = treatment?.duration || 90; // 90 menit default

  // Simulasi fetch data booking
  const fetchBookingsForDate = () => {
    // Contoh data booking (dalam implementasi nyata dari API)
    const mockBookings = [
      { date: selectedDate, startTime: "09:00", duration: 90, bedsUsed: 2 },
      { date: selectedDate, startTime: "10:30", duration: 60, bedsUsed: 1 },
      { date: selectedDate, startTime: "14:00", duration: 90, bedsUsed: 3 },
      { date: selectedDate, startTime: "16:00", duration: 60, bedsUsed: 1 },
    ];
    setBookings(mockBookings);
  };

  // Generate semua slot waktu dari jam buka hingga tutup
  const generateAllTimeSlots = () => {
    const slots = [];
    const interval = 30; // interval 30 menit
    
    for (let hour = CLINIC_HOURS.open; hour < CLINIC_HOURS.close; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        // Skip jika melewati jam tutup
        if (hour === CLINIC_HOURS.close && minute > 0) break;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Hitung jam selesai
  const calculateEndTime = (startTime, duration = TREATMENT_DURATION) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + duration);
    return date.toTimeString().substring(0, 5);
  };

  // Hitung ketersediaan bed untuk setiap slot waktu
  const calculateBedAvailability = useMemo(() => {
    if (!selectedDate) return {};
    
    const allSlots = generateAllTimeSlots();
    const availability = {};
    
    // Inisialisasi semua slot dengan kapasitas penuh
    allSlots.forEach(slot => {
      availability[slot] = BEDS_CAPACITY;
    });
    
    // Kurangi bed untuk setiap booking yang ada
    bookings.forEach(booking => {
      if (booking.date === selectedDate) {
        const startTime = booking.startTime;
        const endTime = calculateEndTime(startTime, booking.duration);
        
        // Kurangi bed untuk setiap slot yang overlap dengan booking
        allSlots.forEach(slot => {
          const slotTime = new Date(`2000-01-01T${slot}:00`);
          const bookingStart = new Date(`2000-01-01T${startTime}:00`);
          const bookingEnd = new Date(`2000-01-01T${endTime}:00`);
          
          // Jika slot berada dalam rentang waktu booking, kurangi bed
          if (slotTime >= bookingStart && slotTime < bookingEnd) {
            availability[slot] = Math.max(0, availability[slot] - booking.bedsUsed);
          }
        });
      }
    });
    
    return availability;
  }, [selectedDate, bookings]);

  // Cek apakah slot waktu valid untuk booking baru
  const isTimeSlotValid = (startTime) => {
    if (!startTime || !selectedDate) return false;
    
    const endTime = calculateEndTime(startTime);
    const slotEndTime = new Date(`2000-01-01T${endTime}:00`);
    const clinicCloseTime = new Date(`2000-01-01T${CLINIC_HOURS.close.toString().padStart(2, '0')}:00:00`);
    
    // Cek apakah treatment selesai sebelum klinik tutup
    if (slotEndTime > clinicCloseTime) {
      return false;
    }
    
    // Cek ketersediaan bed untuk setiap slot selama treatment
    const allSlots = generateAllTimeSlots();
    const treatmentSlots = [];
    
    // Kumpulkan semua slot selama durasi treatment
    let currentTime = new Date(`2000-01-01T${startTime}:00`);
    const endTimeObj = new Date(`2000-01-01T${endTime}:00`);
    
    while (currentTime < endTimeObj) {
      const slot = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      if (allSlots.includes(slot)) {
        treatmentSlots.push(slot);
      }
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    // Cek apakah ada cukup bed di semua slot
    return treatmentSlots.every(slot => 
      calculateBedAvailability[slot] !== undefined && calculateBedAvailability[slot] > 0
    );
  };

  // Dapatkan jumlah bed tersedia untuk slot tertentu
  const getAvailableBedsForSlot = (time) => {
    return calculateBedAvailability[time] || 0;
  };

  // Generate slots yang tersedia untuk ditampilkan
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    return generateAllTimeSlots().filter(slot => {
      // Cek apakah slot valid untuk booking
      return isTimeSlotValid(slot);
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset waktu ketika tanggal berubah
    // Dalam implementasi nyata, fetch data booking untuk tanggal ini
    // fetchBookingsForDate(date);
  };

  const handleNextStep = () => {
    if (!selectedDate || !selectedTime) {
      alert("Silakan pilih tanggal dan jam terlebih dahulu!");
      return;
    }
    
    if (!isTimeSlotValid(selectedTime)) {
      alert("Slot waktu tidak tersedia. Silakan pilih waktu lain.");
      return;
    }
    
    const finalData = {
      ...treatment,
      date: selectedDate,
      startTime: selectedTime,
      endTime: calculateEndTime(selectedTime),
      duration: `${TREATMENT_DURATION} menit`,
      bedsNeeded: 1 // Default 1 bed per treatment
    };
    
    sessionStorage.setItem('finalBooking', JSON.stringify(finalData));
    navigate('/member/booking/success');
  };

  // Format tanggal untuk display
  const formatSelectedDate = () => {
    if (!selectedDate) return "-";
    const date = new Date(selectedDate);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans text-[#3E2723]">
      
      {/* NAVBAR */}
      <nav className="flex items-center gap-3 text-[10px] md:text-xs mb-8 font-bold uppercase tracking-[0.2em] text-gray-400 font-sans">
        <button 
          onClick={() => navigate('/member')} 
          className="p-2 bg-white rounded-lg shadow-sm text-[#8D6E63] hover:bg-[#8D6E63] hover:text-white transition-all border border-gray-100"
        >
          <Home size={16} />
        </button>
        <span>/</span>
        <span className="text-[#8D6E63] bg-[#8D6E63]/10 px-4 py-1.5 rounded-full font-display uppercase tracking-widest">
          Jadwal
        </span>
      </nav>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-gray-100 text-left">
            
            {/* HEADER SECTION */}
            <div className="mb-10 text-left">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-[#5D4037] mb-3 tracking-tighter">Tentukan Jadwal</h1>
              <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed font-sans font-medium">
                Pilih tanggal dan waktu kunjungan Anda. Sistem akan menyesuaikan dengan ketersediaan bed dan jam operasional klinik!
              </p>
            </div>

            <div className="space-y-10 mt-8">
              {/* 1. INPUT TANGGAL */}
              <div>
                <label className="text-[10px] font-black text-[#5D4037] mb-4 uppercase flex items-center gap-2 tracking-widest font-sans ml-1">
                  <CalendarIcon size={14} className="text-[#8D6E63]" /> 1. Pilih Tanggal Perawatan
                </label>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <input 
                    type="date" 
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full md:w-1/2 px-8 py-4 bg-[#FDFBF7] border-2 border-transparent rounded-[20px] outline-none focus:border-[#8D6E63] font-bold text-[#3E2723] font-sans appearance-none cursor-pointer"
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                  {selectedDate && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <CalendarIcon size={14} />
                      <span>{formatSelectedDate()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. PILIH JAM */}
              <div>
                <label className="text-[10px] font-black text-[#5D4037] mb-4 uppercase flex items-center gap-2 tracking-widest font-sans ml-1">
                  <Clock size={14} className="text-[#8D6E63]" /> 2. Pilih Jam Mulai
                </label>
                
                {!selectedDate ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Silakan pilih tanggal terlebih dahulu</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {getAvailableTimeSlots().map((time) => {
                        const availableBeds = getAvailableBedsForSlot(time);
                        const isSelected = selectedTime === time;
                        
                        // Tentukan warna indikator berdasarkan ketersediaan
                        let indicatorColor = '';
                        let statusText = '';
                        
                        if (availableBeds === 0) {
                          indicatorColor = 'bg-red-500';
                          statusText = 'FULL';
                        } else if (availableBeds === 1) {
                          indicatorColor = 'bg-amber-500';
                          statusText = '1 BED';
                        } else if (availableBeds === 2) {
                          indicatorColor = 'bg-blue-500';
                          statusText = '2 BED';
                        } else {
                          indicatorColor = 'bg-green-500';
                          statusText = '3 BED';
                        }
                        
                        return (
                          <button
                            key={time}
                            disabled={availableBeds === 0}
                            onClick={() => setSelectedTime(time)}
                            className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 font-sans group ${
                              isSelected 
                              ? 'bg-[#3E2723] border-[#3E2723] text-white shadow-lg scale-105 z-10' 
                              : availableBeds === 0 
                                ? 'bg-gray-50 border-transparent opacity-30 cursor-not-allowed' 
                                : 'bg-white border-gray-100 text-[#3E2723] hover:border-[#8D6E63]/50 hover:shadow-md'
                            }`}
                          >
                            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${indicatorColor}`}></div>
                            <span className="text-sm font-bold font-display">{time}</span>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${
                              isSelected ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              {statusText}
                            </span>
                            <div className="absolute bottom-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Bed size={10} className="text-gray-400" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Informasi jam operasional dan legenda */}
                    <div className="mt-6 p-4 bg-[#FDFBF7] rounded-2xl border border-gray-100">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-xs font-medium text-gray-600">3 bed tersedia</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-medium text-gray-600">2 bed tersedia</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-medium text-gray-600">1 bed tersedia</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs font-medium text-gray-600">Penuh</span>
                          </div>
                        </div>
                        
                        <div className="text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                          ⏰ Jam Operasional: 08:00 - 20:00
                        </div>
                      </div>
                    </div>
                    
                    {/* Informasi durasi treatment */}
                    <div className="mt-4 text-sm text-gray-600 ml-1">
                      <p className="font-medium">
                        Durasi treatment: <span className="text-[#8D6E63] font-bold">{TREATMENT_DURATION} menit</span> 
                        (≈ {Math.floor(TREATMENT_DURATION / 60)} jam {TREATMENT_DURATION % 60} menit)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RINGKASAN SIDEBAR */}
        <div className="w-full lg:w-96">
          <div className="bg-white border border-gray-200 text-[#3E2723] p-8 rounded-[40px] shadow-lg sticky top-8 text-left">
            <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3 text-[#8D6E63] tracking-tight">
              <Info size={22} /> Ringkasan Booking
            </h3>
            
            <div className="space-y-6 font-sans">
              {/* Treatment Info */}
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-gray-100">
                <p className="text-[9px] text-[#3E2723] uppercase font-black mb-1.5 tracking-widest">Treatment</p>
                <p className="text-sm font-bold leading-snug">{treatment?.name || "-"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock size={12} className="text-gray-500" />
                  <p className="text-xs text-gray-600">{treatment?.duration || `${TREATMENT_DURATION} menit`}</p>
                </div>
              </div>
              
              {/* Date Info */}
              {selectedDate && (
                <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-gray-100">
                  <p className="text-[9px] text-[#3E2723] uppercase font-black mb-1.5 tracking-widest">Tanggal Kunjungan</p>
                  <p className="text-sm font-bold leading-snug">{formatSelectedDate()}</p>
                </div>
              )}
              
              {/* Time Info */}
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-gray-100">
                <p className="text-[9px] text-[#3E2723] uppercase font-black mb-1.5 tracking-widest">Waktu Perawatan</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="text-center p-3 bg-white rounded-xl">
                    <p className="text-[8px] uppercase font-black text-gray-500 tracking-widest mb-1">Mulai</p>
                    <p className="text-lg font-bold font-display text-[#3E2723]">
                      {selectedTime || "--:--"}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <p className="text-[8px] uppercase font-black text-gray-500 tracking-widest mb-1">Selesai</p>
                    <p className="text-lg font-bold font-display text-green-600">
                      {calculateEndTime(selectedTime) || "--:--"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Bed Availability Info */}
              {selectedTime && (
                <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-blue-800 uppercase font-black mb-1 tracking-widest">Ketersediaan Bed</p>
                      <div className="flex items-center gap-2">
                        <Bed size={16} className="text-blue-600" />
                        <p className="text-sm font-bold text-blue-700">
                          {getAvailableBedsForSlot(selectedTime)} dari {BEDS_CAPACITY} bed tersedia
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      getAvailableBedsForSlot(selectedTime) === 3 ? 'bg-green-500' :
                      getAvailableBedsForSlot(selectedTime) === 2 ? 'bg-blue-500' :
                      getAvailableBedsForSlot(selectedTime) === 1 ? 'bg-amber-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Konfirmasi Button */}
            <button 
              onClick={handleNextStep}
              disabled={!selectedDate || !selectedTime}
              className={`w-full mt-10 py-5 rounded-[20px] font-display font-bold uppercase text-[11px] tracking-[0.3em] transition-all shadow-lg ${
                selectedDate && selectedTime 
                ? 'bg-gradient-to-r from-[#8D6E63] to-[#6D4C41] text-white hover:from-white hover:to-white hover:text-[#3E2723] hover:border-2 hover:border-[#8D6E63] active:scale-95' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              {selectedDate && selectedTime ? 'Konfirmasi Booking' : 'Pilih Tanggal & Waktu'}
            </button>
            
            {/* Informasi tambahan */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-[10px] text-gray-500 text-center">
                ⚠️ Pastikan Anda datang 15 menit sebelum waktu booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStep3;