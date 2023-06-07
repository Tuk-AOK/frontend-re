import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setUuid } from "../../../hooks/userSlice";


function Copyright(props: any) {
  
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright ©Crepe '}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '} */}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mainNavigate = () => navigate("/main")
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };
  
  
  //const imagepath = "public\test.jpeg"
  // fetch(imagepath)
  // .then(response => response.blob())
  // .then(blobData => {
  //   const profileImageFile = new File([blobData], "test.jpeg", { type: "image/jpeg" });
  //   // 변환된 File 객체를 활용하는 작업을 수행합니다.
  //   console.log("fetch된 프로필 이미지 : ", profileImageFile);
  // })
  // .catch(error => {
  //   // 오류 처리
  //   console.log(error);
  // });


  const createTestData = () => {
    const formData = new FormData();
    const imagepath = "public\test.jpeg"

    fetch(imagepath)
    .then(response => response.blob())
    .then(blobData => {
      const profileImageFile = new File([blobData], "test.jpeg", { type: "image/jpeg" });
      // 변환된 File 객체를 활용하는 작업을 수행합니다.
      console.log("fetch된 프로필 이미지 : ", profileImageFile);
      
      formData.append("userEmail", "test01@naver.com");
      formData.append("userPassword", "1111"); 
      formData.append("userNickname", "TestName");
      formData.append("userPhoto", profileImageFile);
      // FormData의 key 확인
      // @ts-ignore
      for (const key of formData.keys()) {
        console.log("키값: ", key);
      }
      // FormData의 value 확인
      // @ts-ignore
      for (const value of formData.values()) {
        console.log("밸류값: ", value);
      }
      console.log(formData);

      axios.post('/api/v1/users',{
        data: formData,
      }, {
        headers: {
          "Content-Type" : "multipart/form-data",
        },
        transformRequest: [
          function () {
            return formData;
          }
        ],
      })
      .then((response) => {
        console.log("유저 생성 완료");
        console.log(response);

        //uuid useState에 uuid값 저장
        const uuidData = response.data.data.userUuid
        console.log("발급된 uuid : ", uuidData)
        const disp = dispatch(setUuid(uuidData))
        console.log("안녕",disp)
        mainNavigate();
      })
      .catch((error) => {
        console.log("유저 데이터 생성 실패");
        console.log(error);
      })
    })
    .catch(error => {
      // 오류 처리
      console.log(error);
    });
    
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <CssBaseline />
        <Box
          sx={{
            // marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="ID"
              name="id"
              autoComplete="id"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={createTestData}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  kakao login
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"sign up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}