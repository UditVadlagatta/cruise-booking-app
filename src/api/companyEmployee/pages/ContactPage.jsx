import React, { useEffect, useState } from 'react';
import contactService from '../../../api/services/contactService';

const ContactPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await contactService.getAll();
            setContacts(response.contacts || []);
            setLoading(false);
        } catch (err) {
            setError("Failed to load messages");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await contactService.deleteById(id);
            setContacts((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            alert("Failed to delete message");
        }
    };

    const filteredContacts = contacts.filter((c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-blue-600 font-bold">
            Loading Messages...
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen text-red-500">
            {error}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">
                        Contact <span className="text-indigo-600">Messages</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">{filteredContacts.length} message{filteredContacts.length !== 1 ? "s" : ""}</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-4 h-[75vh] overflow-y-auto pr-2">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((c) => (
                        <div
                            key={c._id}
                            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">

                                {/* Avatar + info */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                                        {c.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">{c.name}</h2>
                                        <p className="text-xs text-slate-400">{c.email}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {new Date(c.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(c._id)}
                                    className="flex-shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                        <path d="M10 11v6"/><path d="M14 11v6"/>
                                        <path d="M9 6V4h6v2"/>
                                    </svg>
                                </button>
                            </div>

                            {/* Message */}
                            <div className="mt-4 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                <p className="text-sm text-slate-600 leading-relaxed">{c.message}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">No messages found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactPage;