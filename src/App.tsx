import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Layout/Header';
import { TabNavigation, Tab } from './components/Layout/TabNavigation';
import { PraktischeInfoForm } from './components/Forms/PraktischeInfoForm';
import { WishListForm } from './components/Forms/WishListForm';
import { ZakelijkAbonnementenForm } from './components/Forms/ZakelijkAbonnementenForm';
import { PriveAbonnementenForm } from './components/Forms/PriveAbonnementenForm';
import { User, Heart, Briefcase, Home } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('praktisch');

  // Mock completion status - in a real app, this would be calculated from actual data
  const tabs: Tab[] = [
    {
      id: 'praktisch',
      label: 'Praktische Info',
      icon: <User className="w-5 h-5" />,
      completed: false
    },
    {
      id: 'wensen',
      label: 'Mijn Wensen',
      icon: <Heart className="w-5 h-5" />,
      completed: false
    },
    {
      id: 'zakelijk',
      label: 'Zakelijk',
      icon: <Briefcase className="w-5 h-5" />,
      completed: false
    },
    {
      id: 'prive',
      label: 'Privé',
      icon: <Home className="w-5 h-5" />,
      completed: false
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'praktisch':
        return <PraktischeInfoForm />;
      case 'wensen':
        return <WishListForm />;
      case 'zakelijk':
        return <ZakelijkAbonnementenForm />;
      case 'prive':
        return <PriveAbonnementenForm />;
      default:
        return <PraktischeInfoForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      <main className="py-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;