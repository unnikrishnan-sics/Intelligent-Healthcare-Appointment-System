import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';
import { Activity, Clock, User } from 'lucide-react';

const LiveQueue = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchQueueData = async () => {
            try {
                // Fetch all doctors. 
                // Note: ideally we might want a lighter endpoint, but getDoctors works 
                // as it returns the full doc object including queueState.
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors`);
                setDoctors(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching live queue", error);
                setLoading(false);
            }
        };

        fetchQueueData();
        // Auto-refresh every 3 seconds for almost real-time updates
        const interval = setInterval(fetchQueueData, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primaryColor}-600`}></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                    <Activity className="text-red-500" /> Live Token Status
                </h1>
                <p className="text-gray-500 mt-2">Real-time updates of ongoing consultations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
                        {/* Header: Doctor Info */}
                        <div className="p-4 bg-gray-50 border-b">
                            <h3 className="font-bold text-lg text-gray-800 truncate">{doctor.userId?.name || 'Dr. Unknown'}</h3>
                            <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                        </div>

                        {/* Live Status Display */}
                        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                            {!doctor.isAvailableToday ? (
                                <div className="text-gray-400 font-medium">
                                    <User size={40} className="mx-auto mb-2 opacity-50" />
                                    <span>Not Available Today</span>
                                </div>
                            ) : doctor.totalBookings === 0 ? (
                                <div className="text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full">
                                    <Clock size={24} className="mx-auto mb-1" />
                                    <span>Available (No Bookings)</span>
                                </div>
                            ) : doctor.queueState?.isPaused ? (
                                <div className="text-amber-500 font-bold flex flex-col items-center animate-pulse bg-amber-50 w-full py-4 rounded-lg">
                                    <Clock size={40} className="mb-2 text-amber-600" />
                                    <span className="text-lg">DOCTOR IS ON BREAK</span>
                                    <span className="text-xs text-amber-700 font-medium mt-1">Please Wait</span>
                                </div>
                            ) : (
                                <>
                                    {/* Show "No Patient" if current token is finished but next not called, OR if token is 0 */}
                                    {(doctor.queueState?.lastTokenCalled === 0 || doctor.currentTokenStatus === 'Completed') ? (
                                        doctor.nextTokenNumber ? (
                                            /* CASE: WAITING FOR SPECIFIC NEXT TOKEN (PRIORITY AWARE) */
                                            <>
                                                <p className="text-blue-600 text-xs uppercase font-bold tracking-widest mb-2">Ready for Next</p>
                                                <div className="relative">
                                                    <div className="w-28 h-28 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                                                        <span className="text-5xl font-black text-blue-600">
                                                            {doctor.nextTokenNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-blue-500 font-bold mt-3 uppercase">
                                                    Please Proceed
                                                </p>
                                            </>
                                        ) : (
                                            /* CASE: ALL FINISHED FOR NOW */
                                            <div className="text-blue-500 font-bold flex flex-col items-center">
                                                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                                                    <User size={32} />
                                                </div>
                                                <span className="text-lg">Waiting for Patients</span>
                                            </div>
                                        )
                                    ) : (
                                        /* CASE: ACTIVELY SERVING */
                                        <>
                                            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-2">Serving Token</p>
                                            <div className="relative">
                                                <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border-4 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]">
                                                    <span className="text-5xl font-black text-gray-800">
                                                        {doctor.queueState?.lastTokenCalled || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Next Token Logic: Only show if actively serving. If waiting (above), we already showed it big. */}
                                    {!(doctor.queueState?.lastTokenCalled === 0 || doctor.currentTokenStatus === 'Completed') &&
                                        doctor.nextTokenNumber && (
                                            <div className="mt-6 w-full bg-blue-50 rounded-lg p-2 flex justify-between items-center px-4">
                                                <span className="text-xs font-semibold text-blue-800 uppercase">Next Token</span>
                                                <span className="text-lg font-bold text-blue-600">
                                                    {doctor.nextTokenNumber}
                                                </span>
                                            </div>
                                        )}

                                    <p className="text-xs text-gray-400 mt-3">
                                        {doctor.queueState?.currentSession || 'Active Session'}
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Footer: Status Indicator */}
                        <div className={`py-2 px-4 text-center text-xs font-bold text-white uppercase tracking-wide ${!doctor.isAvailableToday ? 'bg-gray-400' :
                            doctor.queueState?.isPaused ? 'bg-amber-400' :
                                'bg-green-500'
                            }`}>
                            {!doctor.isAvailableToday ? 'Offline' : doctor.queueState?.isPaused ? 'Paused' : 'Live Now'}
                        </div>
                    </div>
                ))}
            </div>

            {doctors.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    No doctors available to track.
                </div>
            )}
        </div>
    );
};

export default LiveQueue;
