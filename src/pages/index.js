import React, { useEffect, useState } from "react";
import { Modal, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { useRouter } from "next/router"
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Pagination from '@mui/material/Pagination';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "@/theme/theme";
import { useQuery } from "react-query";
import { getPhotos } from "@/api/getPhotos";
import usePagination from "../utils/pagination"

export default function Home() {

  const router = useRouter()

  const { data } = useQuery(["post"],getPhotos)

  const photos = data?.data.slice(0, 500)

  let [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const pageCount = Math.ceil(photos?.length / PER_PAGE);
  const _DATA = usePagination(photos, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const [modalOpen, setOpenModal] = useState(false)
  const [modalImageId, setModalImageId] = useState()

  useEffect(()=>{
    const token=localStorage.getItem("token")
    if(!token) {
      router.push("/login")
    }
  },[router])

  const handleClick = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative" >
        <Toolbar sx={{justifyContent: 'space-between'}}>
          <Box sx={{ display: 'flex'}}>
            <PhotoCameraIcon sx={{ mr: 2, mt: 0.5}} />
            <Typography variant="h6" color="inherit" noWrap>
              Photo Album
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "white",
              '&:hover': {
                backgroundColor: '#fff',
                color: '#3c52b2',
                boxShadow: 1
                }
              }}
            onClick={handleClick}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Album
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              {/* <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button> */}
            </Stack>
          </Container>
        </Box>
        <Grid container justifyContent="center">
          <Pagination page={page}count={pageCount} color="primary" onChange={handleChange}/>
         </Grid>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {_DATA.currentData()?.map((photo) => (
              <Grid item key={photo.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      16:9,
                    }}
                    image={photo.url}
                    alt="random"
                    onClick={() =>{ setOpenModal(true)
                      setModalImageId(photo.id)}
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {photo.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small"
                      onClick={() => {
                        setOpenModal(true)
                        setModalImageId(photo.id)
                      }}
                    >
                      View
                    </Button>
                    {/* <Button size="small">Edit</Button> */}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Grid container justifyContent="center">
          <Pagination page={page}count={pageCount} color="primary" onChange={handleChange}/>
         </Grid>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setOpenModal(false)}
      >
        <CardMedia
            component="img"
            sx={{
              margin: "auto",
              height: 600,
              width: 600
            }}
            image={photos?.[modalImageId - 1]?.url}
            alt="random"
        />
      </Modal>
    </ThemeProvider>
  );
}

