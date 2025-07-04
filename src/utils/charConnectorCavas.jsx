import React, { useEffect, useRef } from "react";

const ChartConnectorCanvas = ({ chartData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.length) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adjusted positioning to match your table layout
    const rowHeight = 48; // Height of each table row
    const cellWidth = 16.4; // Width of each number circle (16px + spacing)
    const offsetLeft = 178; // Left offset to align with the number section
    const centerY = 24; // Center Y position within each row
    const centerX = 8; // Center X offset for each circle

    ctx.strokeStyle = "#ef4444"; // Red color for the connecting lines
    ctx.lineWidth = 2;

    for (let i = 0; i < chartData.length - 1; i++) {
      const current = chartData[i]?.number;
      const next = chartData[i + 1]?.number;

      if (current == null || next == null) continue;

      // Calculate positions for current and next points
      const x1 = offsetLeft + current * cellWidth + centerX;
      const y1 = i * rowHeight + centerY + 40; // +40 to account for header height and padding
      const x2 = offsetLeft + next * cellWidth + centerX;
      const y2 = (i + 1) * rowHeight + centerY + 40;

      // Draw the connecting line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [chartData]);

  return (
    <canvas
      ref={canvasRef}
      width={400} // Reduced width to match table
      height={chartData.length * 48 + 64} // Account for header and row heights
      className="absolute top-0 left-0 pointer-events-none z-10"
      style={{ opacity: 0.8 }}
    />
  );
};

export default ChartConnectorCanvas;