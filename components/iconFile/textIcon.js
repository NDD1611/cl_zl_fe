
const TextIcon = ({ text }) => {
    return <div style={{ width: "42px", height: "52px", position: 'relative' }} >
        <div style={{
            position: 'absolute',
            color: '#fff',
            fontWeight: 600,
            height: '52px',
            width: "42px",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '15px'
        }}>
            {text}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "42px", height: "52px" }} >
            <defs>
                <linearGradient x1="-12.6264293%" y1="145.116121%" x2="74.6344233%" y2="14.4637031%" id="linearGradient-texticon">
                    <stop stopColor="#02D6F8" offset="0%" />
                    <stop stopColor="#01ADEE" offset="100%" />
                </linearGradient>
            </defs>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="File_Type_Solid" transform="translate(-265.000000, -84.000000)">
                    <g id="Group-5-Copy" transform="translate(265.000000, 84.000000)">
                        <g id="icon_file_attach-copy">
                            <path d="M27.937,0 L42,14.063 L42,48 C42,50.209 40.209,52 38,52 L4,52 C1.791,52 0,50.209 0,48 L0,4 C0,1.791 1.791,0 4,0 L27.937,0 Z" id="Page-1" fill="url(#linearGradient-texticon)" />
                            <polygon id="Rectangle-2" fill="#5ECDF7" points="28 0 41 13 28 13" />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    </div>
}
export default TextIcon