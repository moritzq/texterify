import { Spin } from "antd";
import * as React from "react";

function Loading() {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1
            }}
        >
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Loading the bits and bytes...</div>
        </div>
    );
}

export { Loading };
