import { useEffect, useState } from 'react'
import { approveNgo, getNgosByStatus, rejectNgo } from '../../api/adminApi'

export default function AdminDashboard() {
  const [ngos, setNgos] = useState([])
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [error, setError] = useState('')

  const load = () => {
    getNgosByStatus(statusFilter)
      .then((res) => setNgos(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Could not load NGOs.'))
  }

  useEffect(load, [statusFilter])

  const handleApprove = async (id) => {
    await approveNgo(id)
    load()
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejection (optional):') || ''
    await rejectNgo(id, reason)
    load()
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <h1 className="text-2xl font-semibold text-primary-600 mb-6">Admin — NGO Approvals</h1>

      <div className="flex gap-2 mb-6">
        {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-white border'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid gap-4">
        {ngos.length === 0 && <p className="text-neutral-500">No {statusFilter.toLowerCase()} organizations.</p>}
        {ngos.map((ngo) => (
          <div key={ngo.id} className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{ngo.organizationName}</h2>
              <p className="text-sm text-neutral-500">{ngo.address}</p>
              <p className="text-sm text-neutral-500">{ngo.contactName} — {ngo.contactEmail}</p>
              {ngo.status === 'REJECTED' && ngo.rejectionReason && (
                <p className="text-sm text-red-500 mt-1">Reason: {ngo.rejectionReason}</p>
              )}
            </div>
            {ngo.status === 'PENDING' && (
              <div className="flex gap-2">
                <button onClick={() => handleApprove(ngo.id)} className="bg-primary-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-primary-600">
                  Approve
                </button>
                <button onClick={() => handleReject(ngo.id)} className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-red-600">
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}