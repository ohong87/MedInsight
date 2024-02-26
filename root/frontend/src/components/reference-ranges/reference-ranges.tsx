import React from 'react';
import { ReferenceRangesItem } from './reference-ranges-item';
import { BloodValueDetailsProps } from './reference-ranges-item';

export const ReferenceRanges = () => {
    const props: BloodValueDetailsProps = {
        title: 'WBC(10^3.UL)',
        lowReference: '4.5',
        highReference: '11.0',
        graphBars: [
            {
                bgcolor: '#FF0000',
                height: '20px',
            },
        ],
    };

    return (
        <div style={{ width: '100%' }}>
            <ReferenceRangesItem {...props} />
        </div>
    );
};



