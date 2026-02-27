import { BuildingForm } from "@/components/building/BuildingForm";
import BuildingTable from "@/components/building/BuildingTable";
import { useParams } from "react-router-dom";

export default function BuildingGroup() {
    const { buildingGroupId } = useParams();
    return (
        <>
            building group id: {buildingGroupId}
            <BuildingForm />
            <BuildingTable />
        </>
    );
}
