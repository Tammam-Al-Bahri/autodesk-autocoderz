import { BuildingForm } from "@/components/building/BuildingForm";
import BuildingTable from "@/components/building/BuildingTable";
import { type BuildingGroupId } from "@autocoderz/shared";
import { useParams } from "react-router-dom";

export default function BuildingGroup() {
    const { buildingGroupId } = useParams < { buildingGroupId: BuildingGroupId }>();

    if (!buildingGroupId) return <>buildingGroupId not found</>;

    return (
        <>
            building group id: {buildingGroupId}
            <BuildingForm buildingGroupId={buildingGroupId} />
            <BuildingTable buildingGroupId={buildingGroupId} />
        </>
    );
}
