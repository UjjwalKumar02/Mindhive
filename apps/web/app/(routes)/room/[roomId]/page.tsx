import RoomClient from "../../../../components/RoomClient";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const roomId = (await params).roomId;
  if (!roomId || roomId == "") {
    return <p>Error!</p>;
  }

  return <RoomClient roomId={roomId} />;
}
