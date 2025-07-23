import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '../../hooks/useFirestore';
import { WishList } from '../../types';
import { Save, Heart, AlertCircle } from 'lucide-react';

const schema = z.object({
  overlijdensbericht: z.boolean(),
  doodskist: z.string().min(1, 'Verplicht veld'),
  laatsteVerzorging: z.string().min(1, 'Verplicht veld'),
  opbaringLocatie: z.enum(['thuis', 'uitvaartcentrum'], {
    required_error: 'Verplicht veld'
  }),
  soortUitvaart: z.enum(['begraven', 'cremeren'], {
    required_error: 'Verplicht veld'
  }),
  familieGraf: z.boolean().optional(),
  begraafplaats: z.string().optional(),
  naCeremonie: z.boolean(),
  laatsteSamenkomst: z.boolean(),
  kennisgevingDetails: z.string().optional(),
  muziekWensen: z.string().optional(),
  bloemenWensen: z.string().optional(),
  condoleanceVoorkeuren: z.string().optional(),
  ceremoniDetails: z.string().optional(),
  genodigdenLijst: z.string().optional(),
});

export const WishListForm: React.FC = () => {
  const { saveData, loadData, loading, error } = useFirestore();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<WishList>({
    resolver: zodResolver(schema),
    defaultValues: {
      overlijdensbericht: false,
      doodskist: '',
      laatsteVerzorging: '',
      opbaringLocatie: 'thuis',
      soortUitvaart: 'begraven',
      naCeremonie: false,
      laatsteSamenkomst: false,
    }
  });

  const watchSoortUitvaart = watch('soortUitvaart');
  const watchOverlijdensbericht = watch('overlijdensbericht');
  const watchLaatsteSamenkomst = watch('laatsteSamenkomst');

  useEffect(() => {
    loadData('wish_list').then(data => {
      if (data) {
        Object.keys(data).forEach(key => {
          setValue(key as keyof WishList, data[key]);
        });
      }
    });
  }, [setValue, loadData]);

  const onSubmit = async (data: WishList) => {
    await saveData('wish_list', data);
    setLastSaved(new Date());
  };

  const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-sm font-medium text-red-700 mb-1">
      {children} <span className="text-red-500">*</span>
    </label>
  );

  const OptionalLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {children}
    </label>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-red-500" />
            Mijn Wensen
          </h2>
          <p className="text-slate-600">
            Hier kunt u uw wensen voor de uitvaart en ceremonie vastleggen.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Overlijdensbericht */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Overlijdensbericht (Verplicht)
            </h3>
            
            <div>
              <RequiredLabel>Wenst u een overlijdensbericht?</RequiredLabel>
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    {...register('overlijdensbericht')}
                    type="radio"
                    value="true"
                    className="mr-2"
                  />
                  Ja
                </label>
                <label className="flex items-center">
                  <input
                    {...register('overlijdensbericht')}
                    type="radio"
                    value="false"
                    className="mr-2"
                  />
                  Nee
                </label>
              </div>
              
              {watchOverlijdensbericht && (
                <div>
                  <OptionalLabel>Details Overlijdensbericht</OptionalLabel>
                  <textarea
                    {...register('kennisgevingDetails')}
                    rows={4}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Specifieke wensen voor het overlijdensbericht, welke kranten, etc."
                  />
                </div>
              )}
            </div>
          </div>

          {/* Uitvaart Voorkeuren */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Uitvaart Voorkeuren (Verplicht)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel>Doodskist Voorkeur</RequiredLabel>
                <select
                  {...register('doodskist')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                >
                  <option value="">Selecteer doodskist</option>
                  <option value="eiken">Eiken</option>
                  <option value="grenen">Grenen</option>
                  <option value="karton">Karton (milieuvriendelijk)</option>
                  <option value="bamboe">Bamboe (milieuvriendelijk)</option>
                  <option value="geen-voorkeur">Geen voorkeur</option>
                </select>
                {errors.doodskist && (
                  <p className="text-red-600 text-sm mt-1">{errors.doodskist.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Laatste Verzorging</RequiredLabel>
                <select
                  {...register('laatsteVerzorging')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                >
                  <option value="">Selecteer verzorging</option>
                  <option value="thuis">Thuis door familie</option>
                  <option value="uitvaartcentrum">Door uitvaartcentrum</option>
                  <option value="geen-voorkeur">Geen voorkeur</option>
                </select>
                {errors.laatsteVerzorging && (
                  <p className="text-red-600 text-sm mt-1">{errors.laatsteVerzorging.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Opbaring Locatie</RequiredLabel>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('opbaringLocatie')}
                      type="radio"
                      value="thuis"
                      className="mr-2"
                    />
                    Thuis
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('opbaringLocatie')}
                      type="radio"
                      value="uitvaartcentrum"
                      className="mr-2"
                    />
                    Uitvaartcentrum
                  </label>
                </div>
                {errors.opbaringLocatie && (
                  <p className="text-red-600 text-sm mt-1">{errors.opbaringLocatie.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Soort Uitvaart</RequiredLabel>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('soortUitvaart')}
                      type="radio"
                      value="begraven"
                      className="mr-2"
                    />
                    Begraven
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('soortUitvaart')}
                      type="radio"
                      value="cremeren"
                      className="mr-2"
                    />
                    Cremeren
                  </label>
                </div>
                {errors.soortUitvaart && (
                  <p className="text-red-600 text-sm mt-1">{errors.soortUitvaart.message}</p>
                )}
              </div>
            </div>
            
            {watchSoortUitvaart === 'begraven' && (
              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-4">Begraven Opties (Verplicht)</h4>
                
                <div className="space-y-4">
                  <div>
                    <RequiredLabel>Familie Graf</RequiredLabel>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          {...register('familieGraf')}
                          type="radio"
                          value="true"
                          className="mr-2"
                        />
                        Ja, familie graf
                      </label>
                      <label className="flex items-center">
                        <input
                          {...register('familieGraf')}
                          type="radio"
                          value="false"
                          className="mr-2"
                        />
                        Nee, algemeen graf
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <RequiredLabel>Begraafplaats</RequiredLabel>
                    <input
                      {...register('begraafplaats')}
                      className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                      placeholder="Naam en locatie van gewenste begraafplaats"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Na de Ceremonie */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Na de Ceremonie (Verplicht)</h3>
            
            <div className="space-y-4">
              <div>
                <RequiredLabel>Wilt u een bijeenkomst na de ceremonie?</RequiredLabel>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('naCeremonie')}
                      type="radio"
                      value="true"
                      className="mr-2"
                    />
                    Ja
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('naCeremonie')}
                      type="radio"
                      value="false"
                      className="mr-2"
                    />
                    Nee
                  </label>
                </div>
              </div>
              
              <div>
                <RequiredLabel>Wilt u een laatste samenkomst?</RequiredLabel>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('laatsteSamenkomst')}
                      type="radio"
                      value="true"
                      className="mr-2"
                    />
                    Ja
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('laatsteSamenkomst')}
                      type="radio"
                      value="false"
                      className="mr-2"
                    />
                    Nee
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Ceremonie Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Ceremonie Details (Optioneel)</h3>
            
            <div className="space-y-6">
              <div>
                <OptionalLabel>Muziek Wensen</OptionalLabel>
                <textarea
                  {...register('muziekWensen')}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Specifieke nummers, artiesten, of muziekstijlen"
                />
              </div>
              
              <div>
                <OptionalLabel>Bloemen Wensen</OptionalLabel>
                <textarea
                  {...register('bloemenWensen')}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Specifieke bloemen, kleuren, of arrangements"
                />
              </div>
              
              <div>
                <OptionalLabel>Condoleance Voorkeuren</OptionalLabel>
                <textarea
                  {...register('condoleanceVoorkeuren')}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Hoe wilt u dat mensen hun condoleances betuigen?"
                />
              </div>
              
              <div>
                <OptionalLabel>Ceremonie Details</OptionalLabel>
                <textarea
                  {...register('ceremoniDetails')}
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Specifieke wensen voor de ceremonie, sprekers, rituelen, etc."
                />
              </div>
              
              <div>
                <OptionalLabel>Genodigden Lijst</OptionalLabel>
                <textarea
                  {...register('genodigdenLijst')}
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Specifieke personen die uitgenodigd moeten worden"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              {lastSaved && (
                <span>Laatst opgeslagen: {lastSaved.toLocaleString('nl-NL')}</span>
              )}
              {error && (
                <span className="text-red-600">Fout bij opslaan: {error}</span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Opslaan...' : 'Opslaan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};