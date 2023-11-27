import styles from './ModalUpdateInfo.module.scss'
import MainModal from './MainModal'
import { useEffect, useState, useRef } from 'react'
import Avatar from '../Avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from 'react-redux'
import { modalActions } from '../../../redux/actions/modalActions'
import api from '../../../api/api'
import { toast } from 'react-toastify'
import { authActions } from '../../../redux/actions/authAction'
import ExpandDate from './expandDate'
import { checkLeapYear } from '../../../utils/check'
import LoaderModal from './LoaderModal'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.js'
import 'cropperjs/dist/cropper.css'
import { faCamera, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { initializeApp } from 'firebase/app'
import { useLingui } from '@lingui/react'
import { Button, Modal } from '@mantine/core'

const ModalUpdateInfo = () => {
    let i18n = useLingui()
    const showModalUpdateInfo = useSelector((state: any) => state.modal.showModalUpdateInfo)
    const [userDetails, setUserDetails] = useState<any>({})
    const [srcPreview, setSrcPreview] = useState<string>()
    const [showModalCropImage, setShowModalCropImage] = useState(false)
    const [srcAfterCropped, setSrcAfterCropped] = useState(null)
    const [cropper, setCropper] = useState(null)
    const [blobImage, setBlobImage] = useState(null)
    const [haveUpdateAvatar, setHaveUpdateAvatar] = useState(false)
    const [arrYear, setArrYear] = useState([])
    const [arrMonth, setArrMonth] = useState([])
    const [arrDay, setArrDay] = useState([])
    const [selectYear, setSelectYear] = useState('')
    const [selectMonth, setSelectMonth] = useState('')
    const [selectDay, setSelectDay] = useState<any>('')
    const [showScrollYear, setShowScrollYear] = useState(false)
    const [showScrollMonth, setShowScrollMonth] = useState(false)
    const [showScrollDay, setShowScrollDay] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const user = useSelector((state: any) => state.auth.userDetails)
    const dispatch = useDispatch()

    const [file, setFile] = useState(null)

    const imageElement = useRef()
    const inputElement = useRef<HTMLInputElement | null>()

    useEffect(() => {
        const userDetailsFromLocal = JSON.parse(localStorage.getItem('userDetails'))
        setUserDetails(userDetailsFromLocal)
        if (userDetailsFromLocal.birthday) {
            let date = new Date(userDetailsFromLocal.birthday)
            setSelectDay(date.getDate().toString())
            setSelectMonth((date.getMonth() + 1).toString())
            setSelectYear(date.getFullYear().toString())
        }
        const arrYear = []
        for (let i = 1940; i < 2020; i++) {
            arrYear.push(i.toString())
        }
        const arrMonth = []
        for (let i = 1; i <= 12; i++) {
            arrMonth.push(i.toString())
        }
        setArrYear(arrYear)
        setArrMonth(arrMonth)
        return () => {
            setCropper(null)
        }
    }, [user])

    useEffect(() => {
        const dayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let check = checkLeapYear(selectYear)
        let intMonth = parseInt(selectMonth) - 1
        if (check) {
            dayOfMonth[1] = 29
        } else {
            dayOfMonth[1] = 28
        }
        let arrDayFake = []
        for (let i = 1; i <= dayOfMonth[intMonth]; i++) {
            arrDayFake.push(i.toString())
        }
        setArrDay(arrDayFake)
        if (parseInt(selectDay) > parseInt(arrDayFake[arrDayFake.length - 1])) {
            setSelectDay(arrDayFake[arrDayFake.length - 1])
        }
    }, [selectDay, selectMonth, selectYear])

    const handleInputImageChange = (e) => {
        const [file] = e.target.files
        if (file) {
            let src = URL.createObjectURL(file)
            setSrcPreview(src)
            setFile(file)
            setShowModalCropImage(true)
        }
    }

    const handleImgLoad = () => {
        const image = imageElement.current
        setCropper(new Cropper(image, {
            aspectRatio: 1 / 1,
            zoomable: false
        }))
    }

    const handleAcceptCrop = async () => {
        const urlAfterCroppedImage = cropper.getCroppedCanvas().toDataURL('image/png')
        await cropper.getCroppedCanvas().toBlob((blob) => {
            setBlobImage(blob)
            setHaveUpdateAvatar(true)
        })
        setSrcAfterCropped(urlAfterCroppedImage)
        setShowModalCropImage(false)
        inputElement.current.value = ''
        cropper.destroy()
    }

    const handleCloseCropperImage = () => {
        setShowModalCropImage(false)
        if (inputElement.current) {
            inputElement.current.value = ''
        }
        if (cropper) {
            cropper.destroy()
        }
    }

    const handleUpdateInfoUser = async () => {
        setShowLoader(true)
        let birthday = new Date(parseInt(selectYear), parseInt(selectMonth) - 1, parseInt(selectDay)).toDateString()
        if (haveUpdateAvatar) {
            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
                measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
            }
            const app = initializeApp(firebaseConfig);
            const storage = getStorage();
            let fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.png'
            const storageRef = ref(storage, 'file/' + fileName);
            const uploadTask = uploadBytesResumable(storageRef, blobImage);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress)
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    console.log(error)
                    toast.error(i18n._('An error occurred. Please try again later.'))
                    setShowLoader(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        const newInfo = {
                            ...userDetails,
                            avatar: downloadURL,
                            birthday: birthday
                        }
                        const responseUpdate: any = await api.updateUserInfo(newInfo)
                        if (responseUpdate.err) {
                            toast.error(i18n._('An error occurred. Please try again later.'))
                        } else {
                            toast.success(i18n._('Update information successfully!'))
                            localStorage.setItem('userDetails', JSON.stringify(newInfo))

                            dispatch({
                                type: authActions.SET_USER_DETAIL,
                                userDetails: newInfo
                            })
                        }
                        setShowLoader(false)
                    });
                }
            )
        } else {
            let userInfo = {
                ...userDetails,
                birthday: birthday
            }
            const responseUpdate: any = await api.updateUserInfo(userInfo)
            if (responseUpdate.err) {
                toast.error(i18n._('An error occurred. Please try again later.'))
            } else {
                toast.success(i18n._('Update information successfully!'))
                localStorage.setItem('userDetails', JSON.stringify(userInfo))
                dispatch({
                    type: authActions.SET_USER_DETAIL,
                    userDetails: userInfo,
                })
            }
            setShowLoader(false)
        }
        setSrcAfterCropped(null)
        dispatch({ type: modalActions.SET_HIDE_MODAL_UPDATE_INFO })
    }

    const handleCloseModalUpdateInfo = () => {
        if (inputElement.current) {
            inputElement.current.value = ''
            setSrcAfterCropped(null)
            dispatch({ type: modalActions.SET_HIDE_MODAL_UPDATE_INFO })
        }
    }
    const handleShowYear = (e) => {
        e.stopPropagation()
        setShowScrollYear(true)
        setShowScrollMonth(false)
        setShowScrollDay(false)
    }
    const handleShowMonth = (e) => {
        e.stopPropagation()
        setShowScrollYear(false)
        setShowScrollMonth(true)
        setShowScrollDay(false)
    }
    const handleShowDay = (e) => {
        e.stopPropagation()
        setShowScrollYear(false)
        setShowScrollMonth(false)
        setShowScrollDay(true)
    }
    const handleCloseAllDMY = () => {
        setShowScrollYear(false)
        setShowScrollMonth(false)
        setShowScrollDay(false)
    }
    return <>
        <Modal size={'md'} opened={showModalUpdateInfo} onClose={handleCloseModalUpdateInfo} title={i18n._('Update information')}>
            <div className={styles.contentModalInfo} onClick={handleCloseAllDMY}>
                <div className={styles.image}>
                    <img src='/images/backgroundProfile.jpg' />
                </div>

                <div className={styles.avatarInfo}>
                    <Avatar
                        src={srcAfterCropped ? srcAfterCropped : userDetails.avatar}
                        width={80}
                    ></Avatar>
                    <label htmlFor='inputAvatar' className={styles.camera}>
                        <FontAwesomeIcon icon={faCamera} />
                    </label>
                    <input
                        ref={inputElement}
                        className={styles.inputHide}
                        type='file' id="inputAvatar"
                        accept='.jpg, .png'
                        onChange={handleInputImageChange}
                    />
                </div>
                <p className={styles.name}>{userDetails.firstName + ' ' + userDetails.lastName}</p>
                <div className={styles.fullname}>
                    <div>
                        <label>{i18n._('Last name:')}</label>
                        <input
                            value={userDetails.lastName ? userDetails.lastName : ''}
                            onChange={(e) => { setUserDetails({ ...userDetails, lastName: e.target.value }) }}
                        />
                    </div>
                    <div>
                        <label>{i18n._('First name:')}</label>
                        <input
                            value={userDetails.firstName ? userDetails.firstName : ''}
                            onChange={(e) => { setUserDetails({ ...userDetails, firstName: e.target.value }) }}
                        />
                    </div>
                </div>
                <div className={styles.userInfo}>
                    <p className={styles.titleInfo}>{i18n._('Information')}</p>
                    <div className={styles.sexContainer}>
                        <p className={styles.sex}>{i18n._('Sex') + ':'}</p>
                        <div className={styles.inputRadio}>
                            <input
                                type="radio"
                                id="male"
                                name="sex"
                                value="Nam"
                                checked={userDetails.sex === 'Nam' ? true : false}
                                onChange={() => { setUserDetails({ ...userDetails, sex: 'Nam' }) }}
                            />
                            <label htmlFor="male">{i18n._('Male')}</label>
                            <input
                                type="radio"
                                id="Female"
                                name="sex"
                                value="Nữ"
                                checked={userDetails.sex === 'Nữ' ? true : false}
                                onChange={() => { setUserDetails({ ...userDetails, sex: 'Nữ' }) }}
                            />
                            <label htmlFor="Female">{i18n._('Female')}</label>
                        </div>
                    </div>
                    <div className={styles.birthday}>
                        <p>{i18n._('Date of birth')}</p>
                        <div className={styles.dmy}>
                            <div className={styles.subdmy}>
                                {
                                    showScrollDay && <ExpandDate
                                        dataArr={arrDay}
                                        value={selectDay}
                                        setValue={setSelectDay}
                                    />
                                }
                                <div className={styles.clickFake} onClick={(e) => { handleShowDay(e) }}></div>
                                <input disabled value={selectDay} />
                                <FontAwesomeIcon className={styles.arrowDown} icon={faChevronDown} />
                            </div>
                            <div className={styles.subdmy}>
                                {
                                    showScrollMonth && <ExpandDate
                                        dataArr={arrMonth}
                                        value={selectMonth}
                                        setValue={setSelectMonth}
                                    />
                                }

                                <div className={styles.clickFake} onClick={(e) => { handleShowMonth(e) }}></div>
                                <input disabled value={selectMonth} />
                                <FontAwesomeIcon className={styles.arrowDown} icon={faChevronDown} />
                            </div>
                            <div className={styles.subdmy}>
                                {
                                    showScrollYear && <ExpandDate
                                        setValue={setSelectYear}
                                        value={selectYear}
                                        dataArr={arrYear}
                                    />
                                }
                                <div className={styles.clickFake} onClick={(e) => { handleShowYear(e) }}></div>
                                <input disabled value={selectYear} />
                                <FontAwesomeIcon className={styles.arrowDown} icon={faChevronDown} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.divBtn}>
                        <button className={styles.btnCancel} onClick={handleCloseModalUpdateInfo}>
                            {i18n._('Cancel')}
                        </button>

                        {showLoader ?
                            <Button loading>{i18n._('Update')}</Button> :
                            <button className={styles.btnUpdate} onClick={handleUpdateInfoUser}>
                                {i18n._('Update')}
                            </button>
                        }
                    </div>
                </div>
            </div>
        </Modal>
        <Modal className={styles.ModalCropImage} opened={showModalCropImage} onClose={handleCloseCropperImage} fullScreen>
            <div className={styles.imageCrop}>
                <img ref={imageElement} id="image" src={srcPreview} onLoad={() => { handleImgLoad() }} />
            </div>
            <div className={styles.btns} >
                <Button color='gray' className={styles.btnCancelAvatar} onClick={handleCloseCropperImage}>{i18n._('Cancel')}</Button>
                <Button className={styles.btnAcceptAvatar} onClick={handleAcceptCrop}>{i18n._('Select as avatar')}</Button>
            </div>
        </Modal>
    </>

}

export default ModalUpdateInfo;