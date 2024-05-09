const Loader = ({ size }) => {
    if (!size) size = "20px";
    return (
        <div className="flex justify-center items-center p-1">
            <div className="loader" style={{'width': size, 'height': size }}></div>
        </div>
    )
}

export default Loader;