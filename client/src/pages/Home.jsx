import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Shield, Clock, Users, ChevronRight, CheckCircle } from 'lucide-react';

const Home = () => {
    const { theme } = useTheme();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative bg-white pt-24 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                            New: Tele-consultation Available
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
                            Your Health, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                Our Priority
                            </span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Experience the future of healthcare. Book appointments effortlessly, connect with top specialists, and manage your family's health in one secure place.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <Link to="/register" className="px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2" style={{ backgroundColor: theme.primaryColor }}>
                                Book Appointment <ChevronRight size={20} />
                            </Link>
                            <Link to="/about" className="px-8 py-4 rounded-xl text-gray-700 font-bold text-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center">
                                Learn More
                            </Link>
                        </div>
                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-gray-400 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" /> Verified Doctors
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" /> Instant Booking
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                                alt="Modern Hospital"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                            {/* Floating Card */}
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Next Available</p>
                                    <p className="text-sm font-bold text-gray-900">Dr. Sarah is free today!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-blue-600 font-bold tracking-wide uppercase mb-3">Why Choose Us</h2>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Healthcare Reimagined for You</h3>
                        <p className="mt-4 text-xl text-gray-500">We combine technology with care to provide the best possible experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Calendar, title: "Easy Scheduling", desc: "No more phone calls. Book online 24/7." },
                            { icon: Users, title: "Top Specialists", desc: "Consult with industry-leading experts." },
                            { icon: Shield, title: "Secure Records", desc: "Your medical history, safe and accessible." },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{ backgroundColor: theme.primaryColor }}>
                                    <feature.icon size={28} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;
