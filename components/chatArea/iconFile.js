import ImageIcon from "../iconFile/imageIcon"
import PdfIcon from "../iconFile/pdfIcon"
import TextIcon from "../iconFile/textIcon"
import WordIcon from "../iconFile/wordIcon"

const IconFile = ({ ext }) => {
    if (ext == 'docx') {
        return <WordIcon />
    } if (ext == 'jpg' || ext == 'png') {
        return <ImageIcon />
    } if (ext == 'pdf') {
        return <PdfIcon />
    } else {
        return <TextIcon text={ext.toUpperCase()} />
    }
}

export default IconFile