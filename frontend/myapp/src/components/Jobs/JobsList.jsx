import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Loading } from '../Common';
import jobService from '../../services/job';
import toast from 'react-hot-toast';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getAllJobs('open');
        setJobs(response.data.jobs);
      } catch (error) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
      <h1 className="text-4xl font-bold mb-8">Job Opportunities</h1>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card
              key={job._id}
              hover
              className="cursor-pointer"
              onClick={() => navigate(`/jobs/${job._id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {job.jobType}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs available</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default JobsList;