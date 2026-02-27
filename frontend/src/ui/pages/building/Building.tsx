import { useParams } from "react-router-dom";

export default function Building() {
    const { buildingId } = useParams();
    return <>building id: {buildingId}</>;
}
