import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";	// from global state
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

// yup = form validation
// many other yup field types, but mostly using 'string' for simplicity
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
	// if improper email = "invalid email"; if left blank = "required"
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

// just a stripped-down version of 'registerSchema'
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

// initial values for 'register' form
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

// inital values for 'login' form
const initialValuesLogin = {
  email: "",
  password: "",
};

// *** ACTUAL FORM COMPONENT ***
const Form = () => {
  const [pageType, setPageType] = useState("login");	// determines if display 'register' or 'login' form
  const { palette } = useTheme();
  const dispatch = useDispatch();	// to 'dispatch' actions from the reducers
  const navigate = useNavigate();
	// start boolean variables with 'is...':
  const isNonMobile = useMediaQuery("(min-width:600px)");	// use mobile if screen width < 600px
  const isLogin = pageType === "login";	// convenience variable: isLogin = pageType of 'login'
  const isRegister = pageType === "register";	// convenience variable: isRegister = pageType of 'register'

	// User registration logic
  const register = async (values, onSubmitProps) => {
    // formData allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);	// append each key/value to formData
    }
    formData.append("picturePath", values.picture.name);	// file name in storage filesystem

		// send form data to backend 'register' api
    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();	// translate response to json
    onSubmitProps.resetForm();	// clear form entries

		// if successfully submitted registration info, change to login page
    if (savedUser) {
      setPageType("login");
    }
  };

	// User login logic
  const login = async (values, onSubmitProps) => {
		// send form data to backend 'login' api
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();	// translate response to json
    onSubmitProps.resetForm();	// clear form entries
    // if login info is authenticated:
		if (loggedIn) {
      dispatch(
        setLogin({						// must be passed-in as an object:
          user: loggedIn.user,	// set in global state
          token: loggedIn.token,	// set in global state
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);	// runs 'login' function, above
    if (isRegister) await register(values, onSubmitProps);	// runs 'register' function, above
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}	// function from above
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
			{/* variables and functions to use inside of form: */}
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"	// split into equal fractions of 4, with a minimum width of zero (can shrink down to zero)
            // in this example, could actually have just been 2 columns
						sx={{
							// any child 'div's:
							// if on mobile screen, span all 4 columns (entire screen) (override default):
							// don't need specific mediaQuery, because defined 'isNonMobile' query, above
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
						{/* *** if on register page *** */}
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}	// when click out of the input
                  onChange={handleChange}	// handles situation while typing in field
                  value={values.firstName}
                  name="firstName"	// sync to value in 'initialValuesRegister'
                  error={
										// if field has been touched and if also contains an error:
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
									// show error message if touched and has an error
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}	// on wide screens, use half of screen
                />
								{/* same as field above = just change to 'lastName' */}
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
								{/* same as field above = just change to 'location' */}
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}	// use entire screen width
                />
								{/* same as field above = just change to 'occupation' */}
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
								{/* Input profile image: */}
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
									{/* File upload stuff using dropzone */}
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}	// prevent multiple uploads at a time
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])	// manually set formik field value to submitted file
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}	// required by dropzone
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
												{/* if no value for 'picture': */}
                        {!values.picture ? (
                          <p>Add Picture Here (.jpg, .jpeg or .png)</p>
                        ) : (
													// if value for 'picture', show picture name:
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

						{/* same as field above = just change to 'email' */}
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
						{/* same as field above = just change to 'password' */}
            <TextField
              label="Password"
              type="password"	// not used in others = hides value
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"	// executes 'onSubmit' function (handleFormSubmit, in this case)
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
						{/* Link to switch between login and register: */}
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();	// clears form entries
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;