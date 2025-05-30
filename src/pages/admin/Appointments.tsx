import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Clock,
  Car,
  Wrench
} from 'lucide-react';

const Appointments: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  
  // Mock data for appointments
  const appointments = [
    {
      id: '1',
      customer: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      type: 'Test Drive',
      vehicle: '2020 Toyota Camry',
      date: '2023-10-18',
      time: '10:00 AM',
      status: 'Confirmed',
      notes: 'Customer is interested in financing options.',
    },
    {
      id: '2',
      customer: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 987-6543',
      type: 'Service',
      service: 'Oil Change',
      vehicle: '2018 Honda Civic',
      date: '2023-10-18',
      time: '2:30 PM',
      status: 'Pending',
      notes: 'Customer mentioned a strange noise when braking.',
    },
    {
      id: '3',
      customer: 'Michael Brown',
      email: 'mbrown@example.com',
      phone: '(555) 456-7890',
      type: 'Test Drive',
      vehicle: '2021 Ford F-150',
      date: '2023-10-19',
      time: '11:15 AM',
      status: 'Confirmed',
      notes: '',
    },
    {
      id: '4',
      customer: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '(555) 234-5678',
      type: 'Service',
      service: 'Brake Inspection',
      vehicle: '2019 Chevrolet Equinox',
      date: '2023-10-20',
      time: '9:00 AM',
      status: 'Confirmed',
      notes: 'Vehicle is still under warranty.',
    },
  ];
  
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
  };
  
  const handleStatusChange = (status: string) => {
    // In a real app, this would update the appointment status
    alert(`Appointment status changed to ${status}`);
    setSelectedAppointment(null);
  };
  
  // Generate days for the week view
  const generateWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    
    return days;
  };
  
  const weekDays = generateWeekDays();
  
  // Filter appointments for the current view
  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === dateString);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointment Manager</h1>
      
      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="ml-4 text-lg font-semibold text-gray-900">
              {view === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              {view === 'week' && `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              {view === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleToday}
              className="mr-4 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === 'day'
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === 'week'
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === 'month'
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Week View */}
      {view === 'week' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((date, index) => (
              <div 
                key={index} 
                className={`p-4 text-center border-r last:border-r-0 ${
                  date.toDateString() === new Date().toDateString() 
                    ? 'bg-blue-50' 
                    : ''
                }`}
              >
                <p className="text-sm font-medium text-gray-500">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-semibold ${
                  date.toDateString() === new Date().toDateString() 
                    ? 'text-blue-700' 
                    : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 min-h-[500px]">
            {weekDays.map((date, index) => {
              const dayAppointments = getAppointmentsForDate(date);
              return (
                <div 
                  key={index} 
                  className={`p-2 border-r last:border-r-0 ${
                    date.toDateString() === new Date().toDateString() 
                      ? 'bg-blue-50' 
                      : ''
                  }`}
                >
                  {dayAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {dayAppointments.map(appointment => (
                        <div 
                          key={appointment.id}
                          onClick={() => handleViewAppointment(appointment)}
                          className={`p-2 rounded-md cursor-pointer ${
                            appointment.type === 'Test Drive'
                              ? 'bg-blue-100 hover:bg-blue-200'
                              : 'bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          <div className="flex items-center">
                            {appointment.type === 'Test Drive' ? (
                              <Car className="h-4 w-4 mr-1 text-blue-700" />
                            ) : (
                              <Wrench className="h-4 w-4 mr-1 text-green-700" />
                            )}
                            <span className="text-xs font-medium">
                              {appointment.time}
                            </span>
                          </div>
                          <p className="text-sm font-medium truncate">
                            {appointment.customer}
                          </p>
                          <p className="text-xs truncate">
                            {appointment.type === 'Test Drive' 
                              ? appointment.vehicle 
                              : appointment.service}
                          </p>
                          <div className="mt-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              appointment.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <p className="text-sm">No appointments</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Day View */}
      {view === 'day' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
          </div>
          
          <div className="p-4">
            {getAppointmentsForDate(currentDate).length > 0 ? (
              <div className="space-y-4">
                {getAppointmentsForDate(currentDate).map(appointment => (
                  <div 
                    key={appointment.id}
                    onClick={() => handleViewAppointment(appointment)}
                    className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          {appointment.type === 'Test Drive' ? (
                            <Car className="h-5 w-5 mr-2 text-blue-700" />
                          ) : (
                            <Wrench className="h-5 w-5 mr-2 text-green-700" />
                          )}
                          <h4 className="text-lg font-semibold text-gray-900">
                            {appointment.type}
                          </h4>
                        </div>
                        <p className="text-gray-600">
                          {appointment.customer} • {appointment.phone}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{appointment.time}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-gray-700">
                        {appointment.type === 'Test Drive' 
                          ? `Vehicle: ${appointment.vehicle}` 
                          : `Service: ${appointment.service} • Vehicle: ${appointment.vehicle}`}
                      </p>
                      {appointment.notes && (
                        <p className="text-gray-600 mt-1">
                          Notes: {appointment.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-blue-700 hover:text-blue-800 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments for this day</h3>
                <p className="text-gray-500">There are no scheduled appointments for this date.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Month View */}
      {view === 'month' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-7 text-center py-2 border-b">
            <div className="text-sm font-medium text-gray-500">Sun</div>
            <div className="text-sm font-medium text-gray-500">Mon</div>
            <div className="text-sm font-medium text-gray-500">Tue</div>
            <div className="text-sm font-medium text-gray-500">Wed</div>
            <div className="text-sm font-medium text-gray-500">Thu</div>
            <div className="text-sm font-medium text-gray-500">Fri</div>
            <div className="text-sm font-medium text-gray-500">Sat</div>
          </div>
          
          <div className="grid grid-cols-7 grid-rows-5 min-h-[500px]">
            {/* Month calendar cells would go here */}
            <div className="h-full flex items-center justify-center text-gray-400 border p-2">
              <p className="text-sm">Month view coming soon</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    {selectedAppointment.type === 'Test Drive' ? (
                      <Car className="h-6 w-6 text-blue-700" />
                    ) : (
                      <Wrench className="h-6 w-6 text-green-700" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedAppointment.type} Details
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Appointment scheduled for {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-4 border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                      <p className="text-sm font-medium text-gray-900 mt-1">{selectedAppointment.customer}</p>
                      <p className="text-sm text-gray-600">{selectedAppointment.email}</p>
                      <p className="text-sm text-gray-600">{selectedAppointment.phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Appointment Details</h4>
                      <p className="text-sm text-gray-900 mt-1">
                        <span className="font-medium">Type:</span> {selectedAppointment.type}
                      </p>
                      {selectedAppointment.type === 'Service' && (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Service:</span> {selectedAppointment.service}
                        </p>
                      )}
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Vehicle:</span> {selectedAppointment.vehicle}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Date:</span> {new Date(selectedAppointment.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Time:</span> {selectedAppointment.time}
                      </p>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          selectedAppointment.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedAppointment.status}
                        </span>
                      </p>
                    </div>
                    
                    {selectedAppointment.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                        <p className="text-sm text-gray-900 mt-1">{selectedAppointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedAppointment.status === 'Pending' ? (
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Confirmed')}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <Check className="h-5 w-5 mr-1" />
                    Confirm
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-700 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleStatusChange('Cancelled')}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <X className="h-5 w-5 mr-1" />
                  Cancel Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;