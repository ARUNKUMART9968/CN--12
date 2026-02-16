const JobCard = ({ job, onClick }) => {
  const { Card } = require('../Common');
  return (
    <Card onClick={onClick} hover className="cursor-pointer">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500 mt-2">{job.location}</p>
    </Card>
  );
};

export default JobCard;