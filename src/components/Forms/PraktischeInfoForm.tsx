import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore } from '../../hooks/useFirestore';
import { PraktischeInfo } from '../../types';
import { Save, AlertCircle } from 'lucide-react';

const schema = z.object({
  volledigeNaam: z.string().min(1, 'Verplicht veld'),
  bsn: z.string().min(9, 'BSN moet 9 cijfers bevatten').max(9, 'BSN moet 9 cijfers bevatten'),
  geboortedatum: z.string().min(1, 'Verplicht veld'),
  banknummer: z.string().min(1, 'Verplicht veld'),
  straat: z.string().min(1, 'Verplicht veld'),
  huisnummer: z.string().min(1, 'Verplicht veld'),
  postcode: z.string().regex(/^\d{4}[A-Z]{2}$/, 'Postcode moet format 1234AB hebben'),
  woonplaats: z.string().min(1, 'Verplicht veld'),
  provincie: z.string().min(1, 'Verplicht veld'),
  land: z.string().min(1, 'Verplicht veld'),
  telefoon: z.string().min(1, 'Verplicht veld'),
  email: z.string().email('Ongeldig emailadres'),
  uitvaartverzekering: z.boolean(),
  uitvaartverzekeringDetails: z.string().optional(),
  testament: z.boolean(),
  testamentNotaris: z.string().optional(),
  executeur: z.string().optional(),
  donorRegistratie: z.boolean().optional(),
  donorToelichting: z.string().optional(),
  dierbareBezittingen: z.string().optional(),
  belangrijkeDocumenten: z.string().optional(),
});

export const PraktischeInfoForm: React.FC = () => {
  const { saveData, loadData, loading, error } = useFirestore();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PraktischeInfo>({
    resolver: zodResolver(schema),
    defaultValues: {
      volledigeNaam: '',
      bsn: '',
      geboortedatum: '',
      banknummer: '',
      straat: '',
      huisnummer: '',
      postcode: '',
      woonplaats: '',
      provincie: '',
      land: 'Nederland',
      telefoon: '',
      email: '',
      uitvaartverzekering: false,
      testament: false,
      donorRegistratie: false,
    }
  });

  const watchTestament = watch('testament');
  const watchUitvaartverzekering = watch('uitvaartverzekering');

  useEffect(() => {
    loadData('praktische_info').then(data => {
      if (data) {
        Object.keys(data).forEach(key => {
          setValue(key as keyof PraktischeInfo, data[key]);
        });
      }
    });
  }, [setValue, loadData]);

  const onSubmit = async (data: PraktischeInfo) => {
    await saveData('praktische_info', data);
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Praktische Informatie</h2>
          <p className="text-slate-600">
            Vul alle verplichte velden in. Deze informatie is essentieel voor nabestaanden.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Persoonlijke Gegevens */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Persoonlijke Gegevens (Verplicht)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <RequiredLabel>Volledige Naam</RequiredLabel>
                <input
                  {...register('volledigeNaam')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                />
                {errors.volledigeNaam && (
                  <p className="text-red-600 text-sm mt-1">{errors.volledigeNaam.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>BSN</RequiredLabel>
                <input
                  {...register('bsn')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  placeholder="123456789"
                />
                {errors.bsn && (
                  <p className="text-red-600 text-sm mt-1">{errors.bsn.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Geboortedatum</RequiredLabel>
                <input
                  {...register('geboortedatum')}
                  type="date"
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                />
                {errors.geboortedatum && (
                  <p className="text-red-600 text-sm mt-1">{errors.geboortedatum.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Banknummer</RequiredLabel>
                <input
                  {...register('banknummer')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  placeholder="NL00 BANK 0000 0000 00"
                />
                {errors.banknummer && (
                  <p className="text-red-600 text-sm mt-1">{errors.banknummer.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Telefoon</RequiredLabel>
                <input
                  {...register('telefoon')}
                  type="tel"
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  placeholder="06-12345678"
                />
                {errors.telefoon && (
                  <p className="text-red-600 text-sm mt-1">{errors.telefoon.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Email</RequiredLabel>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Adresgegevens */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Adresgegevens (Verplicht)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <RequiredLabel>Straat</RequiredLabel>
                <input
                  {...register('straat')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                />
                {errors.straat && (
                  <p className="text-red-600 text-sm mt-1">{errors.straat.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Huisnummer</RequiredLabel>
                <input
                  {...register('huisnummer')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                />
                {errors.huisnummer && (
                  <p className="text-red-600 text-sm mt-1">{errors.huisnummer.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Postcode</RequiredLabel>
                <input
                  {...register('postcode')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  placeholder="1234AB"
                />
                {errors.postcode && (
                  <p className="text-red-600 text-sm mt-1">{errors.postcode.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Woonplaats</RequiredLabel>
                <input
                  {...register('woonplaats')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                />
                {errors.woonplaats && (
                  <p className="text-red-600 text-sm mt-1">{errors.woonplaats.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Provincie</RequiredLabel>
                <select
                  {...register('provincie')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                >
                  <option value="">Selecteer provincie</option>
                  <option value="Noord-Holland">Noord-Holland</option>
                  <option value="Zuid-Holland">Zuid-Holland</option>
                  <option value="Utrecht">Utrecht</option>
                  <option value="Gelderland">Gelderland</option>
                  <option value="Noord-Brabant">Noord-Brabant</option>
                  <option value="Limburg">Limburg</option>
                  <option value="Zeeland">Zeeland</option>
                  <option value="Overijssel">Overijssel</option>
                  <option value="Flevoland">Flevoland</option>
                  <option value="Drenthe">Drenthe</option>
                  <option value="Groningen">Groningen</option>
                  <option value="Friesland">Friesland</option>
                </select>
                {errors.provincie && (
                  <p className="text-red-600 text-sm mt-1">{errors.provincie.message}</p>
                )}
              </div>
              
              <div>
                <RequiredLabel>Land</RequiredLabel>
                <input
                  {...register('land')}
                  className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                />
                {errors.land && (
                  <p className="text-red-600 text-sm mt-1">{errors.land.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Verplichte Verzekeringen & Testament */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Verzekeringen & Testament (Verplicht)</h3>
            
            <div className="space-y-6">
              <div>
                <RequiredLabel>Uitvaartverzekering</RequiredLabel>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('uitvaartverzekering')}
                      type="radio"
                      value="true"
                      className="mr-2"
                    />
                    Ja
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('uitvaartverzekering')}
                      type="radio"
                      value="false"
                      className="mr-2"
                    />
                    Nee
                  </label>
                </div>
                
                {watchUitvaartverzekering && (
                  <div className="mt-4">
                    <OptionalLabel>Details Uitvaartverzekering</OptionalLabel>
                    <textarea
                      {...register('uitvaartverzekeringDetails')}
                      rows={3}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Verzekeringsmaatschappij, polisnummer, etc."
                    />
                  </div>
                )}
              </div>
              
              <div>
                <RequiredLabel>Testament</RequiredLabel>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      {...register('testament')}
                      type="radio"
                      value="true"
                      className="mr-2"
                    />
                    Ja
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('testament')}
                      type="radio"
                      value="false"
                      className="mr-2"
                    />
                    Nee
                  </label>
                </div>
                
                {watchTestament && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <RequiredLabel>Notaris</RequiredLabel>
                      <input
                        {...register('testamentNotaris')}
                        className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                        placeholder="Naam en contactgegevens notaris"
                      />
                    </div>
                    
                    <div>
                      <RequiredLabel>Executeur Testamentair</RequiredLabel>
                      <input
                        {...register('executeur')}
                        className="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50"
                        placeholder="Naam en contactgegevens executeur"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optionele Velden */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Aanvullende Informatie (Optioneel)</h3>
            
            <div className="space-y-6">
              <div>
                <OptionalLabel>Donor Registratie</OptionalLabel>
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      {...register('donorRegistratie')}
                      type="radio"
                      value="true"
                      className="mr-2"
                    />
                    Ja
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('donorRegistratie')}
                      type="radio"
                      value="false"
                      className="mr-2"
                    />
                    Nee
                  </label>
                </div>
                
                <OptionalLabel>Toelichting Donor Registratie</OptionalLabel>
                <textarea
                  {...register('donorToelichting')}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Eventuele specifieke wensen of beperkingen"
                />
              </div>
              
              <div>
                <OptionalLabel>Locatie Dierbare Bezittingen</OptionalLabel>
                <textarea
                  {...register('dierbareBezittingen')}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Waar bevinden zich waardevolle of sentimentele spullen?"
                />
              </div>
              
              <div>
                <OptionalLabel>Locatie Belangrijke Documenten</OptionalLabel>
                <textarea
                  {...register('belangrijkeDocumenten')}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Waar bevinden zich paspoorten, aktes, verzekeringspapieren, etc.?"
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