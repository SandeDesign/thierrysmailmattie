import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Settings, Shield, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold">Nabestaanden App</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-slate-300" />
              <span className="text-sm text-slate-300">{user?.email}</span>
              {user?.mfaEnabled && (
                <Shield className="w-4 h-4 text-green-400" title="MFA Ingeschakeld" />
              )}
            </div>
            
            <button
              onClick={() => {/* TODO: Open settings */}}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              title="Instellingen"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              title="Uitloggen"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};