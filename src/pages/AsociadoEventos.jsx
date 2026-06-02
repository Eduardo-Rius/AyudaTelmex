import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import PrivateHeader from '../components/layout/PrivateHeader';
import Footer from '../components/layout/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { MOCK_EVENTS, LOGGED_IN_USER } from '../data/mockData';

export default function AsociadoEventos() {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState(LOGGED_IN_USER.age.toString());
  const [gender, setGender] = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const formRef = useRef(null);

  const handleRegisterClick = (eventTitle) => {
    setSelectedEvent(eventTitle);
    setIsRegistered(false);
    // Scroll smoothly to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEvent || !city || !gender || !shirtSize) {
      toast.warning('Por favor, complete todos los campos obligatorios del formulario.');
      return;
    }
    setIsRegistered(true);
    // Reset form after submission
    setCity('');
    setGender('');
    setShirtSize('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <PrivateHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Link */}
        <div className="mb-6 text-left">
          <Link to="/asociado/dashboard" className="inline-flex items-center gap-2 text-primary-brand hover:text-primary-deep font-bold text-base focus-visible:outline-none">
            <ArrowLeft className="h-4 w-4" /> Volver a Mi Resumen
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-primary-deep">Eventos Sociales y Deportivos Nacionales</h2>
          <p className="text-lg text-neutral-muted mt-2">
            Participe en las actividades de recreación, convivencia y deporte organizadas por la Asociación.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {MOCK_EVENTS.map((event) => {
            const isSelectable = event.status === 'Registro Abierto' || event.status === 'Pre-registro';
            return (
              <Card key={event.id} className="flex flex-col justify-between h-full text-left">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="inline-block bg-primary-brand/10 text-primary-deep text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {event.category}
                    </span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                      event.status === 'Registro Abierto'
                        ? 'bg-success-trust/10 text-success-trust border-success-trust/20'
                        : event.status === 'Pre-registro'
                        ? 'bg-warning-alert/10 text-warning-alert border-warning-alert/20'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-primary-deep leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-base text-neutral-muted leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-2 pt-2 text-sm text-neutral-muted">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary-brand" />
                      <span>{event.date} - {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-brand text-accent-tech" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  {isSelectable ? (
                    <Button
                      variant={event.status === 'Registro Abierto' ? 'primary' : 'secondary'}
                      className="w-full text-base py-3"
                      onClick={() => handleRegisterClick(event.title)}
                    >
                      Registrarme
                    </Button>
                  ) : (
                    <Button
                      variant="light"
                      disabled
                      className="w-full text-base py-3"
                    >
                      Registro Cerrado
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Registration Form Area */}
        <div ref={formRef} className="max-w-2xl mx-auto scroll-mt-24">
          {isRegistered ? (
            <Card className="text-center py-10 px-6 space-y-4 border-t-8 border-t-success-trust animate-scale-up">
              <div className="flex justify-center">
                <div className="bg-success-trust/10 p-4 rounded-full text-success-trust">
                  <CheckCircle2 className="h-14 w-14" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-primary-deep">¡Registro Confirmado con Éxito!</h3>
              <p className="text-base text-neutral-muted leading-relaxed">
                Su lugar para el evento <strong className="text-neutral-dark">{selectedEvent}</strong> ha sido reservado. En breve recibirá un correo electrónico con los detalles del itinerario, hospedaje y transporte.
              </p>
              <div className="pt-4">
                <Button variant="primary" onClick={() => setIsRegistered(false)} className="px-6 py-2.5 text-base">
                  Registrar otro participante
                </Button>
              </div>
            </Card>
          ) : (
            selectedEvent && (
              <Card title={`Inscripción: ${selectedEvent}`} className="animate-fade-in text-left">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Select Event (Locked) */}
                  <div className="space-y-2">
                    <label className="block text-base font-bold text-neutral-dark">Evento Seleccionado</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedEvent}
                      className="block w-full bg-gray-100 border-2 border-gray-300 rounded-xl px-4 py-3 text-lg font-bold text-primary-deep focus-visible:outline-none"
                    />
                  </div>

                  {/* Ciudad */}
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-base font-bold text-neutral-dark">Ciudad de Residencia / Seccional</label>
                    <select
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg font-semibold bg-white"
                    >
                      <option value="">Seleccione su seccional</option>
                      <option value="CDMX">Ciudad de México (Central)</option>
                      <option value="Guadalajara">Guadalajara, Jal.</option>
                      <option value="Monterrey">Monterrey, N.L.</option>
                      <option value="Tijuana">Tijuana, B.C. (Telnor)</option>
                      <option value="Mexicali">Mexicali, B.C.</option>
                      <option value="Hermosillo">Hermosillo, Son.</option>
                      <option value="Querétaro">Querétaro, Qro.</option>
                      <option value="Mérida">Mérida, Yuc.</option>
                    </select>
                  </div>

                  {/* Edad & Género Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="age" className="block text-base font-bold text-neutral-dark">Edad del Participante</label>
                      <input
                        type="number"
                        id="age"
                        required
                        min="18"
                        max="110"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg font-semibold bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="block text-base font-bold text-neutral-dark">Género</span>
                      <div className="flex gap-6 pt-3">
                        <label className="flex items-center gap-2 text-base font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            required
                            checked={gender === 'Masculino'}
                            onChange={() => setGender('Masculino')}
                            className="h-5 w-5 text-primary-brand"
                          />
                          <span>Masculino</span>
                        </label>
                        <label className="flex items-center gap-2 text-base font-semibold cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            required
                            checked={gender === 'Femenino'}
                            onChange={() => setGender('Femenino')}
                            className="h-5 w-5 text-primary-brand"
                          />
                          <span>Femenino</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Talla de Playera */}
                  <div className="space-y-2">
                    <label htmlFor="shirt-size" className="block text-base font-bold text-neutral-dark">Talla de Playera Deportiva</label>
                    <select
                      id="shirt-size"
                      required
                      value={shirtSize}
                      onChange={(e) => setShirtSize(e.target.value)}
                      className="block w-full border-2 border-gray-300 rounded-xl px-4 py-3.5 text-lg font-semibold bg-white"
                    >
                      <option value="">Seleccione una talla</option>
                      <option value="CH">Chica (CH)</option>
                      <option value="M">Mediana (M)</option>
                      <option value="G">Grande (G)</option>
                      <option value="XG">Extra Grande (XG)</option>
                      <option value="XXG">Doble Extra Grande (XXG)</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button type="submit" variant="success" className="w-full py-4 text-lg">
                      Confirmar Inscripción Oficial
                    </Button>
                  </div>
                </form>
              </Card>
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
