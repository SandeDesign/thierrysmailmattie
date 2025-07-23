import React, { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';
import { PriveAbonnement } from '../../types';
import { Plus, Trash2, Save, Home, Check } from 'lucide-react';

const categories = [
  { id: 'communicatie', name: 'Communicatie & Media', color: 'bg-blue-50 border-blue-200' },
  { id: 'financieel', name: 'Financiële Diensten', color: 'bg-green-50 border-green-200' },
  { id: 'wonen', name: 'Wonen & Nutsbedrijven', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'zorg', name: 'Zorg & Lifestyle', color: 'bg-red-50 border-red-200' },
  { id: 'lifestyle', name: 'Online Diensten', color: 'bg-purple-50 border-purple-200' },
] as const;

const defaultAbonnementen: Record<string, string[]> = {
  communicatie: [
    'Vast telefoon',
    'Mobiele telefoon',
    'Internet & TV',
    'Netflix',
    'Amazon Prime',
    'Spotify',
    'Disney+',
    'Ziggo/KPN'
  ],
  financieel: [
    'Bankrekening',
    'Spaarrekening',
    'Creditcard',
    'ANWB',
    'Consumentenbond',
    'Beleggen',
    'Pensioen'
  ],
  wonen: [
    'Energie (Gas/Licht)',
    'Water',
    'Gemeente (Afval)',
    'Woonverzekering',
    'Zorgverzekering',
    'Opstalverzekering',
    'Huurverzekering'
  ],
  zorg: [
    'Zorgverzekering',
    'Tandarts',
    'Huisarts',
    'Fysio',
    'Fitness',
    'Maaltijdservice',
    'Thuiszorg'
  ],
  lifestyle: [
    'Webshops',
    'Cloud opslag',
    'VPN diensten',
    'Online games',
    'Streaming diensten',
    'Nieuwsbrieven',
    'Social media'
  ]
};

export const PriveAbonnementenForm: React.FC = () => {
  const { saveAbonnement, loadAbonnementen, deleteAbonnement, loading, error } = useFirestore();
  const [abonnementen, setAbonnementen] = useState<PriveAbonnement[]>([]);
  const [newAbonnement, setNewAbonnement] = useState<Partial<PriveAbonnement>>({
    categorie: 'communicatie',
    naam: '',
    provider: '',
    completed: false
  });
  const [activeCategory, setActiveCategory] = useState<string>('communicatie');

  useEffect(() => {
    loadAbonnementen('prive_abonnementen').then(data => {
      setAbonnementen(data as PriveAbonnement[]);
    });
  }, [loadAbonnementen]);

  const handleAddAbonnement = async () => {
    if (!newAbonnement.naam || !newAbonnement.provider) return;
    
    const abonnement: PriveAbonnement = {
      ...newAbonnement,
      id: Date.now().toString(),
      completed: false
    } as PriveAbonnement;
    
    await saveAbonnement('prive_abonnementen', abonnement);
    setAbonnementen([...abonnementen, abonnement]);
    setNewAbonnement({
      categorie: activeCategory as any,
      naam: '',
      provider: '',
      completed: false
    });
  };

  const handleToggleComplete = async (id: string) => {
    const abonnement = abonnementen.find(a => a.id === id);
    if (!abonnement) return;
    
    const updated = { ...abonnement, completed: !abonnement.completed };
    await saveAbonnement('prive_abonnementen', updated);
    setAbonnementen(abonnementen.map(a => a.id === id ? updated : a));
  };

  const handleDeleteAbonnement = async (id: string) => {
    await deleteAbonnement('prive_abonnementen', id);
    setAbonnementen(abonnementen.filter(a => a.id !== id));
  };

  const addDefaultAbonnement = (name: string) => {
    setNewAbonnement({
      ...newAbonnement,
      naam: name,
      categorie: activeCategory as any
    });
  };

  const filteredAbonnementen = abonnementen.filter(a => a.categorie === activeCategory);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
            <Home className="w-6 h-6 mr-2 text-green-600" />
            Privé Abonnementen
          </h2>
          <p className="text-slate-600">
            Beheer alle privé abonnementen die opgezegd moeten worden.
          </p>
        </div>

        <div className="p-6">
          {/* Category Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.name}
                  {filteredAbonnementen.length > 0 && (
                    <span className="ml-2 bg-white text-green-600 rounded-full px-2 py-1 text-xs">
                      {filteredAbonnementen.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Add New Abonnement */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Nieuw Abonnement Toevoegen - {categories.find(c => c.id === activeCategory)?.name}
            </h3>
            
            {/* Quick Add Buttons */}
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Veelvoorkomende abonnementen:</p>
              <div className="flex flex-wrap gap-2">
                {defaultAbonnementen[activeCategory]?.map(name => (
                  <button
                    key={name}
                    onClick={() => addDefaultAbonnement(name)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Naam Abonnement *
                </label>
                <input
                  type="text"
                  value={newAbonnement.naam}
                  onChange={(e) => setNewAbonnement({...newAbonnement, naam: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Naam van het abonnement"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Provider *
                </label>
                <input
                  type="text"
                  value={newAbonnement.provider}
                  onChange={(e) => setNewAbonnement({...newAbonnement, provider: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Naam van de provider"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Klantnummer
                </label>
                <input
                  type="text"
                  value={newAbonnement.klantnummer || ''}
                  onChange={(e) => setNewAbonnement({...newAbonnement, klantnummer: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Klantnummer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefoon
                </label>
                <input
                  type="tel"
                  value={newAbonnement.telefoon || ''}
                  onChange={(e) => setNewAbonnement({...newAbonnement, telefoon: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Telefoonnummer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newAbonnement.email || ''}
                  onChange={(e) => setNewAbonnement({...newAbonnement, email: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Email adres"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Login
                </label>
                <input
                  type="text"
                  value={newAbonnement.login || ''}
                  onChange={(e) => setNewAbonnement({...newAbonnement, login: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Login gebruikersnaam"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  value={newAbonnement.password || ''}
                  onChange={(e) => setNewAbonnement({...newAbonnement, password: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Wachtwoord"
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notities
                </label>
                <textarea
                  value={newAbonnement.notities || ''}
                  onChange={(e) => setNewAbonnement({...newAbonnement, notities: e.target.value})}
                  rows={2}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Aanvullende notities"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddAbonnement}
                disabled={loading || !newAbonnement.naam || !newAbonnement.provider}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Toevoegen</span>
              </button>
            </div>
          </div>

          {/* Abonnement List */}
          <div className={`${categories.find(c => c.id === activeCategory)?.color} border rounded-lg p-6`}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {categories.find(c => c.id === activeCategory)?.name} Abonnementen
            </h3>
            
            {filteredAbonnementen.length === 0 ? (
              <p className="text-slate-600 text-center py-8">
                Nog geen abonnementen toegevoegd voor deze categorie.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredAbonnementen.map(abonnement => (
                  <div
                    key={abonnement.id}
                    className={`bg-white border rounded-lg p-4 ${
                      abonnement.completed ? 'border-green-300 bg-green-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleToggleComplete(abonnement.id)}
                          className={`p-2 rounded-full ${
                            abonnement.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        
                        <div>
                          <h4 className={`font-medium ${
                            abonnement.completed ? 'text-green-800 line-through' : 'text-slate-800'
                          }`}>
                            {abonnement.naam}
                          </h4>
                          <p className="text-sm text-slate-600">{abonnement.provider}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteAbonnement(abonnement.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {(abonnement.klantnummer || abonnement.telefoon || abonnement.email || abonnement.login) && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {abonnement.klantnummer && (
                          <div>
                            <span className="font-medium">Klantnummer:</span>
                            <p className="text-slate-600">{abonnement.klantnummer}</p>
                          </div>
                        )}
                        {abonnement.telefoon && (
                          <div>
                            <span className="font-medium">Telefoon:</span>
                            <p className="text-slate-600">{abonnement.telefoon}</p>
                          </div>
                        )}
                        {abonnement.email && (
                          <div>
                            <span className="font-medium">Email:</span>
                            <p className="text-slate-600">{abonnement.email}</p>
                          </div>
                        )}
                        {abonnement.login && (
                          <div>
                            <span className="font-medium">Login:</span>
                            <p className="text-slate-600">{abonnement.login}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {abonnement.notities && (
                      <div className="mt-4">
                        <span className="font-medium text-sm">Notities:</span>
                        <p className="text-slate-600 text-sm">{abonnement.notities}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Summary */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Voortgang Overzicht</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map(category => {
                const categoryAbonnementen = abonnementen.filter(a => a.categorie === category.id);
                const completed = categoryAbonnementen.filter(a => a.completed).length;
                const total = categoryAbonnementen.length;
                
                return (
                  <div key={category.id} className="text-center">
                    <div className="text-2xl font-bold text-slate-800">
                      {completed}/{total}
                    </div>
                    <div className="text-sm text-slate-600">{category.name}</div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};