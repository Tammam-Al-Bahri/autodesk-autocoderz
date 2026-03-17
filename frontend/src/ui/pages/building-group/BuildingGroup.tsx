import { BuildingForm } from "@/components/building/BuildingForm";
import BuildingTable from "@/components/building/BuildingTable";
import { type BuildingGroupId } from "@autocoderz/shared";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function BuildingGroup() {
    const { buildingGroupId } = useParams<{ buildingGroupId: BuildingGroupId }>();
    const [showId, setShowId] = useState(false);

    useEffect(() => {
        if (showId) {
            const timer = setTimeout(() => {
                setShowId(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showId]);

    if (!buildingGroupId) {
        return <div>Group ID not found</div>;
    }

    return (
        <div style={{ padding: "16px" }}>
            <div
                onClick={() => setShowId(!showId)}
                style={{
                    cursor: "pointer",
                    marginBottom: "12px",
                    padding: "6px",
                    border: "1px solid #ccc",
                    display: "inline-block"
                }}
            >
                <strong>Group ID:</strong>{" "}
                {showId ? buildingGroupId : "hidden (click to show)"}
            </div>

            <BuildingForm buildingGroupId={buildingGroupId} />
            <BuildingTable buildingGroupId={buildingGroupId} />
        </div>
    );
}