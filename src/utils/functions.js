import axios from 'axios';
import toast from 'react-hot-toast';

const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    else if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
    else if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};

const openFileInNewTab = async (fileKey) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-read`, {
            params: {
                key: fileKey
            }
        })
        window.open(response?.data?.data?.signedUrl, '_blank');
    } catch (error) {
        console.log(error)
    }
}

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


const assignCounsellorHandlerLang = async ({enquiryID,prevCounsellorID, newCounsellorID}) => {
    const submitPromise = new Promise(async (resolve, reject) => {
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/lang-coaching/enquiries/${prevCounsellorID ? 'change-counsellor' : 'assign-counsellor'}/${enquiryID}`,
                {
                    counsellor_id: newCounsellorID
                },{
                    withCredentials:true
                }
            );

            if (res.status === 200) {
                resolve(true); // Resolve with true on success
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message)
            reject(false); // Reject with false on error
        }
    });

    toast.promise(
        submitPromise,
        {
            loading: "Updating counsellor...",
            success: () => `Counsellor assigned successfully`,
            error: (err) => err?.response?.data?.message || err.message,
        }
    );

    return submitPromise; // Return the promise which will resolve to true or false
}

const getPresignedUrlToUpload = async ({path, fileType, isPublic}) => {
    var params = {
        path,
        fileType,
    }

    if (isPublic) {
        params.public = 1
    }

    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-upload`,
        {
            params
        }
    );

    return res?.data?.data
}

const uploadFileToS3 = async (file, path, isPublic = false, id) => {
    try {

        var params = {
            path,
            fileType: file.type,
        }

        if (isPublic) {
            params.public = 1
        }

        if (id) {
            params.id = id
        }

        // Get pre-signed URL from backend
        const presignedUrl = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-upload`,
            {
                params
            }
        );

        const uploadUrl = presignedUrl?.data?.data?.signedUrl;


        // upload file to s3
        await axios.put(uploadUrl, file, {
            headers: {
                "Content-Type": file.type,
            }
        });

        return presignedUrl?.data?.data?.key

    } catch (error) {
        console.log("Error uploading file:", error);
    }
};

const getPresignedUrlToRead = async (fileKey) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/generate-presigned-url-to-read`, {
            params: {
                key: fileKey
            }
        })
        return response?.data?.data?.signedUrl
    } catch (error) {
        console.log(error)
    }
}


export function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options).replace(',', '');
}



function parseStringCondition({expression, data}) {
    // Handle parentheses for grouping first
    if (expression.includes('(') && expression.includes(')')) {
        // Find the innermost parentheses
        const start = expression.lastIndexOf('(');
        const end = expression.indexOf(')', start);
        if (start !== -1 && end !== -1) {
            const innerExpression = expression.substring(start + 1, end);
            const innerResult = parseStringCondition({expression: innerExpression, data});
            // Replace the parentheses expression with the boolean result
            const newExpression = expression.substring(0, start) + innerResult.toString() + expression.substring(end + 1);
            return parseStringCondition({expression: newExpression, data});
        }
    }
    
    // Handle logical operators
    if (expression.includes('&&')) {
        const conditions = expression.split('&&').map(cond => cond.trim());
        return conditions.every(condition => parseStringCondition({expression: condition, data}));
    }
    
    if (expression.includes('||')) {
        const conditions = expression.split('||').map(cond => cond.trim());
        return conditions.some(condition => parseStringCondition({expression: condition, data}));
    }
    
    // Handle boolean values (from parentheses results)
    if (expression === 'true') return true;
    if (expression === 'false') return false;
    
    // Handle simple conditions (no logical operators)
    const operators = ['==', '!=', '>=', '<=', '>', '<', '===', '!=='];
    
    // Find which operator is used in the expression
    let operator = null;
    for (const op of operators) {
        if (expression.includes(op)) {
            operator = op;
            break;
        }
    }
    
    if (!operator) {
        throw new Error('No valid operator found in expression');
    }
    
    // Split the expression by the operator
    const parts = expression.split(operator).map(part => part.trim());
    const leftSide = parts[0];
    const rightSide = parts[1];
    
    // Extract the property value from the object
    const propertyValue = data[leftSide];
    
    // Parse the right side value (handle strings, numbers, booleans)
    let expectedValue;
    if (rightSide.startsWith("'") && rightSide.endsWith("'")) {
        // String value
        expectedValue = rightSide.slice(1, -1);
    } else if (rightSide === 'true') {
        expectedValue = true;
    } else if (rightSide === 'false') {
        expectedValue = false;
    } else if (!isNaN(rightSide)) {
        // Number value
        expectedValue = Number(rightSide);
    } else {
        // Assume it's a property name
        expectedValue = data[rightSide];
    }
    
    // Evaluate the condition
    switch (operator) {
        case '==':
            return propertyValue == expectedValue;
        case '===':
            return propertyValue === expectedValue;
        case '!=':
            return propertyValue != expectedValue;
        case '!==':
            return propertyValue !== expectedValue;
        case '>':
            return propertyValue > expectedValue;
        case '>=':
            return propertyValue >= expectedValue;
        case '<':
            return propertyValue < expectedValue;
        case '<=':
            return propertyValue <= expectedValue;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}


const deleteFileByUrl = async (url, isPrivate = false) => {
    try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/delete-file-by-url`, {
            data: {
                url: url,
                isPrivate: false
            }
        })
    } catch (error) {
        alert('Error deleting image')
    }
}


const highlightText = (text, keyword) => {
    if (!keyword || !text) return text;


    const regex = new RegExp(`(${keyword?.trim()})`, 'gi');
    const parts = text?.toString().split(regex);

    return parts.map((part, index) =>
        regex.test(part) ?
            <span key={index} className="bg-yellow-200 dark:text-yellow-400">{part}</span> :
            part
    );
};

const convertTimeTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

const padStart = (value, pad, char) => {
    return value.toString().padStart(pad, char)
}

const formatDateWithTimeAndDay = (date) => {
    // desired format: Sat, May 17, 2:04 PM
    const dateObj = new Date(date)
    const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    const year = dateObj.getFullYear()
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const dayOfMonth = dateObj.getDate()

    // show time in 24 hour format
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    return `${padStart(dayOfMonth, 2, '0')} ${month} ${year} at ${time}`
}


export {
    formatBytes,
    openFileInNewTab,
    assignCounsellorHandler,
    assignCounsellorHandlerLang,
    uploadFileToS3,
    getPresignedUrlToUpload,
    getPresignedUrlToRead,
    parseStringCondition,
    deleteFileByUrl,
    highlightText,
    convertTimeTo12HourFormat,
    formatDateWithTimeAndDay
}