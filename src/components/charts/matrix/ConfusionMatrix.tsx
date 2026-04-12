import { ResponsiveHeatMap } from '@nivo/heatmap';

interface ConfusionMatrixProps {
  matrixData: number[][]; 
  labels: string[];
}

const ConfusionMatrix = ({ matrixData, labels }: ConfusionMatrixProps) => {
    console.log(matrixData);
    const data = matrixData.length > 0 && matrixData[0].length > 0 ?  labels.map((label, index) => ({
        id: label,
        data: labels.map((l, i) => ({
        x: l,
        y: matrixData[index][i]
        }))
    })) : [];

    return (
        <div style={{ height: '400px' }}>
        
        <ResponsiveHeatMap
            data={data}
            margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
            colors={{
            type: 'sequential',
            scheme: 'blues',
            }}
            emptyColor="#f7fbff" 
            axisTop={{
            tickSize: 5,
            tickPadding: 5,
            legend: 'Predicted Label',
            legendPosition: 'middle',
            legendOffset: -40
            }}
            axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            legend: 'Actual Label',
            legendPosition: 'middle',
            legendOffset: -70
            }}
            labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
        </div>
    )
}

export default ConfusionMatrix;