import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Loading, Button } from '../Common';
import jobService from '../../services/job';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobService.getJobDetails(jobId);
        setJob(response.data.job);
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobService.applyForJob(jobId);
      toast.success('Applied successfully!');
    } catch (error) {
      toast.error('Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600">{job.company}</p>
          </div>
          <Button onClick={handleApply} loading={applying}>Apply Now</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
          <div>
            <p className="text-gray-600 text-sm">Location</p>
            <p className="font-bold">{job.location}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Job Type</p>
            <p className="font-bold">{job.jobType}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Experience</p>
            <p className="font-bold">{job.experienceLevel}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Applicants</p>
            <p className="font-bold">{job.applicants?.length || 0}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JobDetails;