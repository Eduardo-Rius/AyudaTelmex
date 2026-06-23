// src/pages/AdminBeneficiarios.jsx

import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { CheckCircle2, X, AlertCircle, Download, Users } from 'lucide-react';
import { getBeneficiaryChangeRequests, approveBeneficiaryChangeRequest, rejectBeneficiaryChangeRequest, requestMoreInformation } from '../services/beneficiariesService';
import { createAuditLog } from '../services/auditService';
import { LOGGED_IN_USER } from '../data/mockData';

export default function AdminBeneficiarios() {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const loadRequests = () => {
    const data = getBeneficiaryChangeRequests();
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const openModal = (req) => {
    setSelectedReq(req);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReq(null);
    setShowModal(false);
  };

  const handleApprove = () => {
    if (!selectedReq) return;
    approveBeneficiaryChangeRequest(selectedReq.id);
    createAuditLog({
      action: 'BENEFICIARY_CHANGE_APPROVED',
      module: 'GestiónBeneficiarios',
      associateId: selectedReq.associateId,
      user: LOGGED_IN_USER.name,
      entityId: selectedReq.id,
    });
    loadRequests();
    closeModal();
  };

  const handleReject = (reason) => {
    if (!selectedReq) return;
    rejectBeneficiaryChangeRequest(selectedReq.id, reason);
    createAuditLog({
      action: 'BENEFICIARY_CHANGE_REJECTED',
      module: 'GestiónBeneficiarios',
      associateId: selectedReq.associateId,
      user: LOGGED_IN_USER.name,
      entityId: selectedReq.id,
    });
    loadRequests();
    closeModal();
  };

  const handleMoreInfo = (reason) => {
    if (!selectedReq) return;
    requestMoreInformation(selectedReq.id, reason);
    createAuditLog({
      action: 'BENEFICIARY_MORE_INFO_REQUIRED',
      module: 'GestiónBeneficiarios',
      associateId: selectedReq.associateId,
      user: LOGGED_IN_USER.name,
      entityId: selectedReq.id,
    });
    loadRequests();
    closeModal();
  };

  // KPI calculations
  const pending = requests.filter(r => r.status === 'PENDING').length;
  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const rejected = requests.filter(r => r.status === 'REJECTED').length;
  const avgApprovalTime = (() => {
    const approvedReqs = requests.filter(r => r.status === 'APPROVED' && r.createdAt && r.approvedAt);
    if (approvedReqs.length === 0) return '-';
    const totalMs = approvedReqs.reduce((sum, r) => sum + (new Date(r.approvedAt) - new Date(r.createdAt)), 0);
    const avgDays = totalMs / approvedReqs.length / (1000 * 60 * 60 * 24);
    return `${avgDays.toFixed(1)} d`;
  })();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-bg">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-neutral-muted">Solicitudes pendientes</h3>
            <p className="text-3xl font-bold text-primary-deep">{pending}</p>
          </Card>
          <Card className="bg-white p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-neutral-muted">Solicitudes aprobadas</h3>
            <p className="text-3xl font-bold text-primary-deep">{approved}</p>
          </Card>
          <Card className="bg-white p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-neutral-muted">Solicitudes rechazadas</h3>
            <p className="text-3xl font-bold text-primary-deep">{rejected}</p>
          </Card>
          <Card className="bg-white p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-neutral-muted">Tiempo promedio de aprobación</h3>
            <p className="text-3xl font-bold text-primary-deep">{avgApprovalTime}</p>
          </Card>
        </div>

        {/* Requests Table */}
        <Card title="Solicitudes de cambio de beneficiarios">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-bold text-sm text-neutral-muted">ID</th>
                <th className="pb-2 font-bold text-sm text-neutral-muted">Asociado</th>
                <th className="pb-2 font-bold text-sm text-neutral-muted">Fecha</th>
                <th className="pb-2 font-bold text-sm text-neutral-muted">Estatus</th>
                <th className="pb-2 font-bold text-sm text-neutral-muted">Acción</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-150 hover:bg-gray-50/50">
                  <td className="py-2 text-base font-medium text-neutral-dark">{r.id}</td>
                  <td className="py-2 text-base text-neutral-muted">{r.associateId}</td>
                  <td className="py-2 text-base text-neutral-muted">{new Date(r.requestDate).toLocaleDateString()}</td>
                  <td className="py-2 text-base font-medium">
                    {r.status === 'APPROVED' && <span className="text-success-trust"><CheckCircle2 className="inline h-4 w-4 mr-1" />Aprobado</span>}
                    {r.status === 'REJECTED' && <span className="text-red-600"><X className="inline h-4 w-4 mr-1" />Rechazado</span>}
                    {r.status === 'MORE_INFO_REQUIRED' && <span className="text-yellow-600"><AlertCircle className="inline h-4 w-4 mr-1" />Info requerida</span>}
                    {r.status === 'PENDING' && <span className="text-blue-600">Pendiente</span>}
                  </td>
                  <td className="py-2">
                    <Button variant="secondary" size="sm" onClick={() => openModal(r)}>
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Modal for request details and actions */}
        {showModal && selectedReq && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-bold text-primary-deep mb-4">Detalle de la solicitud {selectedReq.id}</h3>
              <p><strong>Asociado:</strong> {selectedReq.associateId}</p>
              <p><strong>Fecha:</strong> {new Date(selectedReq.requestDate).toLocaleString()}</p>
              <p><strong>Estatus:</strong> {selectedReq.status}</p>

              <h4 className="mt-4 font-semibold">Beneficiarios actuales</h4>
              <ul className="list-disc list-inside mb-2">
                {selectedReq.beneficiariesCurrent.map((b, i) => (
                  <li key={i}>{b.name} ({b.relationship}) - {b.percentage}%</li>
                ))}
              </ul>

              <h4 className="mt-2 font-semibold">Beneficiarios propuestos</h4>
              <ul className="list-disc list-inside mb-4">
                {selectedReq.beneficiariesProposed.map((b, i) => (
                  <li key={i}>{b.name} ({b.relationship}) - {b.percentage}%</li>
                ))}
              </ul>

              {/* Action buttons */}
              <div className="flex space-x-2 mt-4">
                <Button variant="success" onClick={handleApprove}>Aprobar</Button>
                <Button variant="danger" onClick={() => {
                  const reason = prompt('Motivo del rechazo:');
                  if (reason) handleReject(reason);
                }}>Rechazar</Button>
                <Button variant="warning" onClick={() => {
                  const reason = prompt('Motivo para solicitar más información:');
                  if (reason) handleMoreInfo(reason);
                }}>Solicitar info</Button>
                <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
