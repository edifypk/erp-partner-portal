import axios from 'axios';
import toast from 'react-hot-toast';

const highlightText = (text, keyword) => {
    if (!keyword || !text) return text;


    const regex = new RegExp(`(${keyword?.trim()})`, 'gi');
    const parts = text?.toString().split(regex);

    return parts.map((part, index) =>
        regex.test(part) ?
            <span key={index} className="bg-yellow-200">{part}</span> :
            part
    );
};

const assignCounsellorHandler = async ({ enquiryID, prevCounsellorID, newCounsellorID }) => {

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/enquiries/${prevCounsellorID ? 'change-counsellor' : 'assign-counsellor'}/${enquiryID}`,
        {
          counsellor_id: newCounsellorID
        }, {
        withCredentials: true
      }
      );

      toast.success("Counsellor assigned successfully")
      return true

    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
      return false
    }
  }

export {
    highlightText,
    assignCounsellorHandler,
}
