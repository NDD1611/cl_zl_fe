
import styles from './ModalUpdateInfo.module.scss'
import MainModal from './MainModal';
import { useEffect, useState, useRef } from 'react';
import Avatar from '../Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector, useDispatch } from 'react-redux';
import { modalActions } from '../../../redux/actions/modalActions';
import api from '../../../api/api';
import { toast } from 'react-toastify'
import addPathToLinkAvatar from '../../../utils/path'
import { authActions } from '../../../redux/actions/authAction';
import ExpandDate from './expandDate';
import { checkLeapYear } from '../../../utils/check';
import LoaderModal from './LoaderModal'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.js'
import 'cropperjs/dist/cropper.css'
import { faCamera, faChevronDown } from '@fortawesome/free-solid-svg-icons';


const ModalUpdateInfo = () => {
    const showModalUpdateInfo = useSelector(state => state.modal.showModalUpdateInfo)
    const [userDetails, setUserDetails] = useState({})
    const [srcPreview, setSrcPreview] = useState()
    const [showModalropImage, setShowModalCropImage] = useState(false)
    const [srcAfterCropped, setSrcAfterCropped] = useState(null)
    const [cropper, setCropper] = useState(null)
    const [blobImage, setBlobImage] = useState(null)
    const [haveUpdateAvatar, setHaveUpdateAvatar] = useState(false)
    const [arrYear, setArrYear] = useState([])
    const [arrMonth, setArrMonth] = useState([])
    const [arrDay, setArrDay] = useState([])
    const [selectYear, setSelectYear] = useState('')
    const [selectMonth, setSelectMonth] = useState('')
    const [selectDay, setSelectDay] = useState('')
    const [showScollYear, setShowScollYear] = useState(false)
    const [showScollMonth, setShowScollMonth] = useState(false)
    const [showScollDay, setShowScollDay] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const user = useSelector(state => state.auth.userDetails)
    const dispatch = useDispatch()

    const [file, setFile] = useState(null)

    const imageElement = useRef()
    const inputElement = useRef()

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
        inputElement.current.value = ''
        cropper.destroy()
    }

    const handleUpdateInfoUser = async () => {
        setShowLoader(true)
        let formData = new FormData()
        let birthday = new Date(selectYear, parseInt(selectMonth) - 1, selectDay).toDateString()
        if (haveUpdateAvatar) {
            formData.append('avatar', blobImage, 'cropedimage.jpg')
            const response = await api.uploadAvatar(formData)

            if (response.err) {
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
            } else {
                const newInfo = {
                    ...userDetails,
                    avatar: response.data.avatar,
                    birthday: birthday
                }
                const responseUpdate = await api.updateUserInfo(newInfo)
                if (responseUpdate.err) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
                } else {
                    toast.success('Cập nhật thông tin thành công')
                    localStorage.setItem('userDetails', JSON.stringify(newInfo))

                    dispatch({
                        type: authActions.SET_USER_DETAIL,
                        userDetails: newInfo
                    })
                }
            }
        } else {
            let userInfo = {
                ...userDetails,
                birthday: birthday
            }
            const responseUpdate = await api.updateUserInfo(userInfo)
            if (responseUpdate.err) {
                toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau')
            } else {
                toast.success('Cập nhật thông tin thành công')
                localStorage.setItem('userDetails', JSON.stringify(userInfo))

                dispatch({
                    type: authActions.SET_USER_DETAIL,
                    userDetails: userInfo,
                })
            }
        }
        setSrcAfterCropped(null)
        dispatch({ type: modalActions.SET_HIDE_MODAL_UPDATE_INFO })
        setShowLoader(false)
    }

    const handleCloseModalUpdateInfo = () => {
        inputElement.current.value = ''
        setSrcAfterCropped(null)
        dispatch({ type: modalActions.SET_HIDE_MODAL_UPDATE_INFO })
    }
    const handleShowYear = (e) => {
        e.stopPropagation()
        setShowScollYear(true)
        setShowScollMonth(false)
        setShowScollDay(false)
    }
    const handleShowMonth = (e) => {
        e.stopPropagation()
        setShowScollYear(false)
        setShowScollMonth(true)
        setShowScollDay(false)
    }
    const handleShowDay = (e) => {
        e.stopPropagation()
        setShowScollYear(false)
        setShowScollMonth(false)
        setShowScollDay(true)
    }
    const handleCloseAllDMY = () => {
        setShowScollYear(false)
        setShowScollMonth(false)
        setShowScollDay(false)
    }
    return (
        <>
            {showLoader ? <LoaderModal /> : ''}
            <MainModal
                title='Cập nhật thông tin'
                closeModal={showModalUpdateInfo}
                setCloseModal={handleCloseModalUpdateInfo}
            >
                <div className={styles.contentModalInfo} onClick={handleCloseAllDMY}>

                    <div className={`${styles.modalCropImage} ${showModalropImage ? '' : styles.hideModal}`}>
                        <div className={styles.backgroundModal}></div>
                        <div className={styles.imageCrop}>
                            <img ref={imageElement} id="image" src={srcPreview} onLoad={() => { handleImgLoad() }} />
                        </div>
                        <div className={styles.btns} >
                            <button className={styles.btnCancelAvatar} onClick={handleCloseCropperImage}>Hủy</button>
                            <button className={styles.btnAcceptAvatar} onClick={handleAcceptCrop}>Chọn làm ảnh đại diện</button>
                        </div>
                    </div>

                    <div className={styles.image}>
                        <img src='/images/backgroundProfile.jpg' />
                    </div>

                    <div className={styles.avatarInfo}>
                        <Avatar
                            src={srcAfterCropped ? srcAfterCropped : addPathToLinkAvatar(userDetails.avatar)}
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
                            <label>Họ:</label>
                            <input
                                value={userDetails.lastName ? userDetails.lastName : ''}
                                onChange={(e) => { setUserDetails({ ...userDetails, lastName: e.target.value }) }}
                            />
                        </div>
                        <div>
                            <label>Tên:</label>
                            <input
                                value={userDetails.firstName ? userDetails.firstName : ''}
                                onChange={(e) => { setUserDetails({ ...userDetails, firstName: e.target.value }) }}
                            />
                        </div>
                    </div>
                    <div className={styles.userInfo}>
                        <p className={styles.titleInfo}>Thông tin cá nhân</p>
                        <p className={styles.sex}>Giới tính</p>

                        <div className={styles.inputRadio}>
                            <input
                                type="radio"
                                id="male"
                                name="sex"
                                value="Nam"
                                checked={userDetails.sex === 'Nam' ? true : false}
                                onChange={() => { setUserDetails({ ...userDetails, sex: 'Nam' }) }}
                            />
                            <label htmlFor="male">Nam</label>
                            <input
                                type="radio"
                                id="Female"
                                name="sex"
                                value="Nữ"
                                checked={userDetails.sex === 'Nữ' ? true : false}
                                onChange={() => { setUserDetails({ ...userDetails, sex: 'Nữ' }) }}
                            />
                            <label htmlFor="Female">Nữ</label>
                        </div>


                        <div className={styles.birthday}>
                            <p>Ngày sinh</p>
                            <div className={styles.dmy}>
                                <div className={styles.subdmy}>
                                    {
                                        showScollDay && <ExpandDate
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
                                        showScollMonth && <ExpandDate
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
                                        showScollYear && <ExpandDate
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
                                Hủy
                            </button>
                            <button className={styles.btnUpdate} onClick={handleUpdateInfoUser}>
                                Cập nhật
                            </button>

                        </div>

                    </div>
                </div>
            </MainModal>
        </>
    )
}

export default ModalUpdateInfo;