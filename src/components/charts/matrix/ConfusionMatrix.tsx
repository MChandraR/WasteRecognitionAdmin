import { ResponsiveHeatMap } from '@nivo/heatmap';

interface ConfusionMatrixProps {
  matrixData: number[][]; 
  labels: string[];
}

const ConfusionMatrix = ({ matrixData, labels }: ConfusionMatrixProps) => {
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
            margin={{ top: 20, right:100, bottom: 20, left: 20 }} // Left dikecilkan karena sudah kosong
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
            axisLeft = {null}       
            axisRight={{
                tickRotation : 0,
                tickSize: 5,
                tickPadding: 5,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 50 
            }}
            
            labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
        </div>
    )
}

export default ConfusionMatrix;