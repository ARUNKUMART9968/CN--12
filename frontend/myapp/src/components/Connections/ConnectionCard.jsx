const ConnectionCard = ({ connection }) => {
  return (
    <Card hover>
      <h3 className="font-bold text-lg">{connection.senderName}</h3>
      <p className="text-gray-600 text-sm">Status: {connection.status}</p>
    </Card>
  );
};

export default ConnectionCard;