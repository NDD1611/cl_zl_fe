
import Cropper from "cropperjs"
import { useEffect } from "react";
import styles from './cropper.module.scss'
import 'cropperjs//dist/cropper.js'
import 'cropperjs/dist/cropper.css'

const CropperComponent = () => {

    useEffect(() => {
        const image = document.getElementById('image');
        const cropper = new Cropper(image, {
            aspectRatio: 1 / 1,

        });
    }, [])


    return (
        <>
            <div className={styles.container}>
                <div>
                    <img id='image' src='/images/profile.jpg' />
                </div>
            </div>
        </>
    )
}

export default CropperComponent