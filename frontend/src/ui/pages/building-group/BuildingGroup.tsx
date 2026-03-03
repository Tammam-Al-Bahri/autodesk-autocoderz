import { BuildingForm } from "@/components/building/BuildingForm";
import BuildingTable from "@/components/building/BuildingTable";
import { useParams } from "react-router-dom";

export default function BuildingGroup() {
    const { buildingGroupId } = useParams();

    if (!buildingGroupId) return <>buildingGroupId not found</>;

    return (
        <>
            building group id: {buildingGroupId}
            <BuildingForm buildingGroupId={buildingGroupId} />
            <BuildingTable buildingGroupId={buildingGroupId} />
        </>
    );
}
