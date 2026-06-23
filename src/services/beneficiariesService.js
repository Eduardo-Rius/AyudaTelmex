// src/services/beneficiariesService.js

// Service for handling beneficiaries and change requests using localStorage (mock).
// All access goes through this layer; UI should never touch localStorage directly.

/**
 * Helper to get the logged in associate ID. In a real app this would come from auth.
 */
const getCurrentAssociateId = () => {
  const user = JSON.parse(localStorage.getItem('logged_in_user')) || {};
  return user.id || '';
};

/** Retrieve beneficiaries for a given associate. */
export const getBeneficiariesByAssociate = (associateId) => {
  if (associateId !== '902847') return [];

  return [
    {
      beneficiaryId: 'BEN-001',
      associateId: '902847',
      name: 'María de Lourdes Rius',
      relationship: 'Esposa',
      percentage: 50,
      status: 'ACTIVE',
    },
    {
      beneficiaryId: 'BEN-002',
      associateId: '902847',
      name: 'Eduardo Rius Jr.',
      relationship: 'Hijo',
      percentage: 25,
      status: 'ACTIVE',
    },
    {
      beneficiaryId: 'BEN-003',
      associateId: '902847',
      name: 'Sofía Rius Torres',
      relationship: 'Hija',
      percentage: 25,
      status: 'ACTIVE',
    },
  ];
};

/** Save beneficiaries for an associate (used after approval). */
const _saveBeneficiaries = (associateId, beneficiaries) => {
  const key = `beneficiaries_${associateId}`;
  localStorage.setItem(key, JSON.stringify(beneficiaries));
};

/** Create a new change request. */
export const createBeneficiaryChangeRequest = (payload) => {
  const listKey = 'beneficiaryChangeRequests';
  const existing = JSON.parse(localStorage.getItem(listKey)) || [];
  const newRequest = {
    id: `REQ-${Date.now()}`,
    associateId: payload.associateId,
    requestDate: new Date().toISOString(),
    status: 'PENDING',
    reason: payload.reason || '',
    beneficiariesCurrent: payload.beneficiariesCurrent || [],
    beneficiariesProposed: payload.beneficiariesProposed || [],
    createdAt: new Date().toISOString(),
  };
  const updated = [...existing, newRequest];
  localStorage.setItem(listKey, JSON.stringify(updated));
  return newRequest.id;
};

/** Retrieve all change requests. */
export const getBeneficiaryChangeRequests = () => {
  const listKey = 'beneficiaryChangeRequests';
  return JSON.parse(localStorage.getItem(listKey)) || [];
};

/** Approve a request and update beneficiaries. */
export const approveBeneficiaryChangeRequest = (requestId) => {
  const listKey = 'beneficiaryChangeRequests';
  const requests = JSON.parse(localStorage.getItem(listKey)) || [];
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return false;
  const req = requests[idx];
  req.status = 'APPROVED';
  // Update beneficiaries for the associate.
  _saveBeneficiaries(req.associateId, req.beneficiariesProposed);
  requests[idx] = req;
  localStorage.setItem(listKey, JSON.stringify(requests));
  return true;
};

/** Reject a request with a reason. */
export const rejectBeneficiaryChangeRequest = (requestId, reason) => {
  const listKey = 'beneficiaryChangeRequests';
  const requests = JSON.parse(localStorage.getItem(listKey)) || [];
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return false;
  const req = requests[idx];
  req.status = 'REJECTED';
  req.reason = reason;
  requests[idx] = req;
  localStorage.setItem(listKey, JSON.stringify(requests));
  return true;
};

/** Request more information (status MORE_INFO_REQUIRED). */
export const requestMoreInformation = (requestId, reason) => {
  const listKey = 'beneficiaryChangeRequests';
  const requests = JSON.parse(localStorage.getItem(listKey)) || [];
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return false;
  const req = requests[idx];
  req.status = 'MORE_INFO_REQUIRED';
  req.reason = reason;
  requests[idx] = req;
  localStorage.setItem(listKey, JSON.stringify(requests));
  return true;
};

/** Export all functions as a default object for convenient import. */
export default {
  getBeneficiariesByAssociate,
  createBeneficiaryChangeRequest,
  getBeneficiaryChangeRequests,
  approveBeneficiaryChangeRequest,
  rejectBeneficiaryChangeRequest,
  requestMoreInformation,
};
