import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Loading, Button } from '../Common';
import jobService from '../../services/job';
import toast from 'react-hot-toast';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await jobService.getJobApplicants(jobId);
        setApplicants(response.data.applicants);
      } catch (error) {
        toast.error('Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await jobService.updateApplicantStatus(jobId, applicantId, newStatus);
      setApplicants(applicants.map(a =>
        a._id === applicantId ? { ...a, status: newStatus } : a
      ));
      toast.success('Status updated!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">Job Applicants</h1>

      {applicants.length > 0 ? (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <Card key={applicant._id}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{applicant.studentName}</h3>
                  <p className="text-gray-600 text-sm">Applied {new Date(applicant.appliedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleStatusChange(applicant._id, 'shortlisted')}
                    variant="success"
                    size="sm"
                  >
                    Shortlist
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(applicant._id, 'rejected')}
                    variant="danger"
                    size="sm"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">No applicants yet</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default JobApplicants;