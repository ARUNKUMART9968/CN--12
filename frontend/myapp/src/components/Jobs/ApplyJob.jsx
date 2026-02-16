import React, { useState } from 'react';
import { Button } from '../Common';
import jobService from '../../services/job';
import toast from 'react-hot-toast';

const ApplyJob = ({ jobId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      await jobService.applyForJob(jobId);
      toast.success('Applied successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return <Button onClick={handleApply} loading={loading}>Apply for Job</Button>;
};

export default ApplyJob;