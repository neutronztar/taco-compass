import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg
            viewBox="0 0 340 340"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit={2}
            {...props}
        >
            <Path
                d="M-3433.21 150.176c-4.79.004-8.91 3.525-9.66 8.258l-16.05 101.805a9.784 9.784 0 019.66-8.258h47.04c47.34 0 87.51-34.533 94.85-81.331.54-3.494.85-7.021.92-10.557-12.03-6.308-26.16-9.917-41.65-9.917h-85.11z"
                transform="translate(3070.68 -82.314) translate(502.185)"
                fill="#001c64"
                fillRule="nonzero"
            />
            <Path
                d="M-3306.45 160.097a79.4 79.4 0 01-.92 10.556c-7.34 46.798-47.52 81.332-94.85 81.332h-47.04a9.78 9.78 0 00-9.66 8.258l-14.76 93.551-9.24 58.688c-.07.413-.1.83-.1 1.248 0 4.354 3.58 7.937 7.94 7.937h51.05c4.8-.004 8.92-3.526 9.66-8.259l13.45-85.292c.75-4.736 4.88-8.258 9.67-8.258h30.06c47.34 0 87.51-34.534 94.85-81.332 5.21-33.214-11.52-63.436-40.11-78.425v-.004z"
                transform="translate(3070.68 -82.314) translate(502.185)"
                fill="#0070e0"
                fillRule="nonzero"
            />
            <Path
                d="M-3491.21 82.314a9.78 9.78 0 00-9.66 8.251l-40.06 254.045c-.76 4.822 2.97 9.184 7.85 9.184h59.41l14.75-93.551 16.05-101.805c.75-4.733 4.87-8.254 9.66-8.258h85.11c15.49 0 29.62 3.613 41.65 9.917.83-42.606-34.33-77.783-82.67-77.783h-102.09z"
                transform="translate(3070.68 -82.314) translate(502.185)"
                fill="#003087"
                fillRule="nonzero"
            />
        </Svg>
    );
}

export default SvgComponent;
