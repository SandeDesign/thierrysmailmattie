import React, { useState } from 'react';
import { Send, Copy, Sparkles, Mail, ArrowRight, CheckCircle, Zap } from 'lucide-react';

const EmailAssistant = () => {
  const [rawThoughts, setRawThoughts] = useState('');
  const [replyingTo, setReplyingTo] = useState('');
  const [selectedTone, setSelectedTone] = useState('vriendelijk');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAssertiving, setIsAssertiving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReplySection, setShowReplySection] = useState(false);

  const tones = [
    { id: 'vriendelijk', label: 'Vriendelijk', description: 'Warm en toegankelijk' },
    { id: 'formeel', label: 'Formeel', description: 'Professioneel en beleefd' },
    { id: 'beknopt', label: 'Beknopt', description: 'To the point en efficiënt' },
    { id: 'enthousiast', label: 'Enthousiast', description: 'Energiek en positief' },
    { id: 'zakelijk', label: 'Zakelijk', description: 'Neutraal en direct' },
    { id: 'empathisch', label: 'Empathisch', description: 'Begripvol en ondersteunend' },
    { id: 'ultradirect', label: 'Ultra Direct', description: 'Geen poespas, puur zakelijk', color: 'orange' },
    { id: 'geïrriteerd', label: 'Geïrriteerd', description: 'Duidelijk ontevreden', color: 'red' }
  ];

  const generateEmail = async () => {
    if (!rawThoughts.trim()) return;
    
    setIsGenerating(true);
    
    try {
      let toneInstruction = '';
      
      if (selectedTone === 'ultradirect') {
        toneInstruction = 'Schrijf een EXTREEM directe en zakelijke email. Geen beleefdheidsfrases, geen omhaal, geen "ik hoop dat dit email je goed vindt". Kom meteen ter zake, gebruik korte zinnen, en eindig direct na het punt. Wees professioneel maar ongelooflijk direct en efficiënt.';
      } else if (selectedTone === 'geïrriteerd') {
        toneInstruction = 'Schrijf een email waarin de irritatie en ontevredenheid duidelijk doorklinkt, maar blijf professioneel en gepast voor zakelijke communicatie. Gebruik ferme taal, directe vragen, en maak duidelijk dat je niet tevreden bent met de situatie. Wees assertief en streng, maar cross nooit de lijn naar onprofessioneel gedrag.';
      } else {
        toneInstruction = `De email moet een ${selectedTone} toon hebben.`;
      }

      const prompt = `Je bent een expert Nederlandse email schrijver. ${replyingTo ? `Je reageert op deze email: "${replyingTo}"` : ''} 
      
${toneInstruction}

Schrijf een email gebaseerd op deze ruwe gedachten: "${rawThoughts}"

Houd rekening met de Nederlandse email etiquette en zorg ervoor dat de email:
- Natuurlijk en authentiek klinkt
- De juiste toon heeft zoals beschreven
- Goed gestructureerd is
- Geschikt is voor professionele communicatie (ook bij assertieve tonen)

Geef alleen de email tekst terug, zonder extra uitleg.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      setGeneratedEmail(data.content[0].text);
    } catch (error) {
      console.error('Fout bij het genereren van email:', error);
      setGeneratedEmail('Er is een fout opgetreden bij het genereren van je email. Probeer het opnieuw.');
    }
    
    setIsGenerating(false);
  };

  const enhanceEmail = async () => {
    if (!generatedEmail.trim()) return;
    
    setIsEnhancing(true);
    
    try {
      const prompt = `Verbeter deze Nederlandse email door deze nog beter, professioneler en effectiever te maken. Behoud de oorspronkelijke betekenis en toon, maar maak de formulering nog sterker:

"${generatedEmail}"

Geef alleen de verbeterde email tekst terug.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      setGeneratedEmail(data.content[0].text);
    } catch (error) {
      console.error('Fout bij het verbeteren van email:', error);
    }
    
    setIsEnhancing(false);
  };

  const makeMoreAssertive = async () => {
    if (!generatedEmail.trim()) return;
    
    setIsAssertiving(true);
    
    try {
      const prompt = `Maak deze Nederlandse email VEEL assertiever en krachtiger. Gebruik fermere taal, directere statements, en laat er geen twijfel over bestaan wat er verwacht wordt. Behoud professionaliteit maar maak de toon veel sterker en assertiever:

"${generatedEmail}"

Transformeer dit naar een veel krachtigere, assertievere versie die duidelijk maakt dat je serieus bent. Geef alleen de verbeterde email tekst terug.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      setGeneratedEmail(data.content[0].text);
    } catch (error) {
      console.error('Fout bij het assertiever maken van email:', error);
    }
    
    setIsAssertiving(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Fout bij kopiëren:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                Email Assistent
              </h1>
              <p className="text-gray-600 text-sm">Schrijf betere emails met AI ondersteuning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Jouw Gedachten
            </h2>
            <p className="text-purple-100 mt-1">Beschrijf kort wat je wilt zeggen</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <textarea
                value={rawThoughts}
                onChange={(e) => setRawThoughts(e.target.value)}
                placeholder="Bijvoorbeeld: Ik wil een vergadering plannen voor volgende week om het nieuwe project te bespreken..."
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Reply Section Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReplySection(!showReplySection)}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ArrowRight className={`w-4 h-4 transform transition-transform ${showReplySection ? 'rotate-90' : ''}`} />
                <span className="font-medium">Reageren op een email? (optioneel)</span>
              </button>
            </div>

            {/* Reply Section */}
            {showReplySection && (
              <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-100">
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Email waarop je reageert
                </label>
                <textarea
                  value={replyingTo}
                  onChange={(e) => setReplyingTo(e.target.value)}
                  placeholder="Plak hier de email waarop je wilt reageren..."
                  className="w-full h-24 p-3 border border-purple-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none text-gray-700"
                />
              </div>
            )}

            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kies de gewenste toon
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                      selectedTone === tone.id
                        ? tone.color === 'orange'
                          ? 'border-orange-400 bg-orange-50 shadow-lg'
                          : tone.color === 'red'
                          ? 'border-red-400 bg-red-50 shadow-lg'
                          : 'border-purple-400 bg-purple-50 shadow-lg'
                        : tone.color === 'orange'
                        ? 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
                        : tone.color === 'red'
                        ? 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-25'
                        : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-25'
                    }`}
                  >
                    <div className={`font-medium ${
                      tone.color === 'orange' 
                        ? 'text-orange-800' 
                        : tone.color === 'red' 
                        ? 'text-red-800' 
                        : 'text-gray-800'
                    }`}>
                      {tone.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{tone.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateEmail}
              disabled={!rawThoughts.trim() || isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-r-transparent"></div>
                  Email wordt gegenereerd...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Genereer Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Email Section */}
        {generatedEmail && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Jouw Email
              </h2>
              <p className="text-purple-100 mt-1">Klaar om te versturen</p>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-100">
                <pre className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed">
                  {generatedEmail}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Gekopieerd!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Kopieer Email
                    </>
                  )}
                </button>

                <button
                  onClick={enhanceEmail}
                  disabled={isEnhancing}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isEnhancing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></div>
                      Verbeteren...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Verbeter Email
                    </>
                  )}
                </button>

                <button
                  onClick={makeMoreAssertive}
                  disabled={isAssertiving}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isAssertiving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></div>
                      Assertiever maken...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Assertiever
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-400 text-sm">
        <p>Gemaakt met ❤️ en AI • Jouw email assistent voor professionele communicatie</p>
      </div>
    </div>
  );
};

export default EmailAssistant;