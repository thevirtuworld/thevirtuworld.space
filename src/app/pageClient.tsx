"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Stack,
  Chip,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

// Simulate loading for the interactive elements
const LoadingScreen = () => (
  <Box 
    sx={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: 9999, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default'
    }}
  >
    <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
      <Typography variant="h3" sx={{ mb: 4, color: 'primary.main', fontWeight: 700 }}>
        TheVirtuWorld
      </Typography>
      <LinearProgress 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          bgcolor: 'grey.800',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #4D7CFF 0%, #FF4D94 100%)',
          }
        }} 
      />
      <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
        Loading Virtual Experience...
      </Typography>
    </Box>
  </Box>
);

const Navbar = () => (
  <AppBar 
    position="fixed" 
    elevation={0}
    sx={{ 
      bgcolor: 'rgba(5, 10, 24, 0.7)', 
      backdropFilter: 'blur(10px)',
      borderBottom: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)'
    }}
  >
    <Container maxWidth="xl">
      <Toolbar sx={{ py: 1 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              bgcolor: 'primary.main',
              mr: 2,
              animation: 'glow 3s ease-in-out infinite alternate',
            }} 
          />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            TheVirtuWorld
          </Typography>
        </Link>
        
        <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Link href="#games" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: 'text.primary', '&:hover': { color: 'primary.main' }, transition: 'color 0.3s' }}>
              Games
            </Typography>
          </Link>
          <Link href="#creators" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: 'text.primary', '&:hover': { color: 'primary.main' }, transition: 'color 0.3s' }}>
              Creators
            </Typography>
          </Link>
          <Link href="#metaverse" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: 'text.primary', '&:hover': { color: 'primary.main' }, transition: 'color 0.3s' }}>
              Metaverse
            </Typography>
          </Link>
          <Link href="/genesis" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: 'accent.main', '&:hover': { color: 'accent.light' }, transition: 'color 0.3s' }}>
              🏛️ Genesis
            </Typography>
          </Link>
          <Link href="#web3" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: 'text.primary', '&:hover': { color: 'primary.main' }, transition: 'color 0.3s' }}>
              Web3
            </Typography>
          </Link>
        </Stack>
        
        <Stack direction="row" spacing={2} sx={{ ml: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            Connect Wallet
          </Button>
        </Stack>
      </Toolbar>
    </Container>
  </AppBar>
);

const HeroSection = () => (
  <Box 
    sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      pt: 10,
      overflow: 'hidden',
      background: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 0%, rgba(5, 10, 24, 1) 100%)',
        zIndex: 1,
      }
    }}
  >
    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10, py: 10 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} lg={6}>
          <Typography variant="h2" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
            <Box component="span" sx={{ display: 'block' }}>The Ultimate</Box>
            <Box component="span" sx={{ color: 'primary.main' }}>Gaming Metaverse</Box>
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Discover, play, create, and own in the world's largest Web3 gaming ecosystem. Real world simulation meets blockchain innovation.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
            <Button 
              component={Link}
              href="/genesis"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(90deg, #EA580C 0%, #DC2626 100%)',
                fontSize: '1.125rem',
                py: 2,
                px: 4,
                animation: 'pulse 2s infinite',
                '&:hover': {
                  background: 'linear-gradient(90deg, #C2410C 0%, #B91C1C 100%)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              ⚒️ Forge Assets
            </Button>
            <Button 
              component={Link}
              href="/play2d"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'accent.main',
                color: 'accent.main',
                fontSize: '1.125rem',
                py: 2,
                px: 4,
                '&:hover': {
                  borderColor: 'accent.light',
                  bgcolor: 'rgba(77, 255, 163, 0.1)',
                }
              }}
            >
              AI Simulation
            </Button>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <AvatarGroup max={4}>
              {[1, 2, 3, 4].map((i) => (
                <Avatar key={i} sx={{ width: 40, height: 40, bgcolor: 'grey.800' }} />
              ))}
            </AvatarGroup>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>10k+</Box> players online
            </Typography>
          </Stack>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Box 
            sx={{ 
              position: 'relative',
              height: 500,
              animation: 'float 6s ease-in-out infinite',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                border: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                animation: 'glow 3s ease-in-out infinite alternate',
              }}
            >
              <Image 
                src="/images/gameplay.png" 
                alt="TheVirtuWorld Gameplay" 
                fill
                style={{ objectFit: 'cover' }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 96,
                height: 96,
                bgcolor: 'rgba(77, 255, 163, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 2,
                border: 1,
                borderColor: 'rgba(77, 255, 163, 0.3)',
                animation: 'pulse 2s infinite',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>NFT</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Assets</Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                position: 'absolute',
                bottom: 40,
                left: -40,
                width: 128,
                height: 128,
                bgcolor: 'rgba(138, 77, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 2,
                border: 1,
                borderColor: 'rgba(138, 77, 255, 0.3)',
                animation: 'pulse 2s infinite',
                overflow: 'hidden',
              }}
            >
              <Image 
                src="/images/gameplay.png" 
                alt="Web3 Powered" 
                fill
                style={{ objectFit: 'cover', opacity: 0.5 }}
              />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>Web3</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Powered</Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      
      <Box 
        sx={{ 
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Box 
          sx={{ 
            width: 24,
            height: 40,
            border: 2,
            borderColor: 'grey.400',
            borderRadius: 999,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box 
            sx={{ 
              width: 4,
              height: 12,
              bgcolor: 'grey.400',
              borderRadius: 999,
              mt: 1,
              animation: 'bounce 1s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(8px)' },
              }
            }} 
          />
        </Box>
      </Box>
    </Container>
  </Box>
);

const FeaturedGames = () => (
  <Box component="section" id="games" sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
        Featured Games
      </Typography>
      <Typography variant="h6" sx={{ mb: 6, color: 'text.secondary' }}>
        Experience the best of our virtual world
      </Typography>
      
      <Grid container spacing={4}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Card 
              sx={{ 
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  borderColor: 'primary.main',
                  '& .MuiCardMedia-root': {
                    transform: 'scale(1.1)',
                  }
                }
              }}
            >
              <Box sx={{ overflow: 'hidden', position: 'relative', height: 200 }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.3s',
                  }}
                >
                  <Image 
                    src="/images/gameplay.png" 
                    alt={`Virtual Game ${i} gameplay`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <Chip
                    label="Web3"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                    }}
                  />
                </CardMedia>
              </Box>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Virtual Game {i}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="body2">4.{9-i}</Typography>
                  </Stack>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  An immersive experience in the virtual world.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.700' }} />
                  <Typography variant="caption">Studio {i}</Typography>
                </Stack>
                <Button 
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    bgcolor: 'rgba(77, 124, 255, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(77, 124, 255, 0.2)',
                    }
                  }}
                >
                  Play Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button 
          variant="outlined"
          size="large"
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              borderColor: 'primary.main',
            }
          }}
        >
          View All Games
        </Button>
      </Box>
    </Container>
  </Box>
);

const Metaverse = () => (
  <Box 
    component="section" 
    id="metaverse" 
    sx={{ 
      py: 10, 
      position: 'relative', 
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        opacity: 0.2,
        background: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }
    }}
  >
    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} lg={6}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
            The Real World Simulation
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Our metaverse provides the foundation for all games, simulating real world physics, economies, and social interactions. Build anything imaginable on our virtual world platform.
          </Typography>
          <List>
            {["Persistent World", "Real Physics", "Dynamic Economy", "Cross-Game Assets"].map((feature) => (
              <ListItem key={feature} sx={{ px: 0 }}>
                <Box 
                  sx={{ 
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: 'rgba(77, 124, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                    }} 
                  />
                </Box>
                <ListItemText primary={feature} />
              </ListItem>
            ))}
          </List>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Box sx={{ position: 'relative', height: 400 }}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                border: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(45deg, rgba(138, 77, 255, 0.2), rgba(77, 239, 255, 0.2))',
                animation: 'glow 3s ease-in-out infinite alternate',
              }}
            />
            <Paper
              elevation={0}
              sx={{
                position: 'absolute',
                bottom: -20,
                right: -20,
                width: 128,
                height: 128,
                bgcolor: 'rgba(255, 77, 148, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 2,
                border: 1,
                borderColor: 'rgba(255, 77, 148, 0.3)',
                animation: 'float 6s ease-in-out infinite',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Infinite</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Possibilities</Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const CreatorSection = () => (
  <Box component="section" id="creators" sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
        Game Creators
      </Typography>
      <Typography variant="h6" sx={{ mb: 6, color: 'text.secondary' }}>
        Build and monetize your own games in our ecosystem
      </Typography>
      
      <Grid container spacing={6}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Developer Tools
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Access powerful tools to build, test, and deploy your games in our metaverse. No complex blockchain knowledge required.
              </Typography>
              <List>
                {["SDK Access", "Asset Marketplace", "Testing Environment", "Revenue Sharing"].map((tool) => (
                  <ListItem key={tool} sx={{ px: 0, py: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'primary.main', mr: 1 }}>→</Typography>
                    <ListItemText primary={tool} primaryTypographyProps={{ color: 'text.secondary' }} />
                  </ListItem>
                ))}
              </List>
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                sx={{ mt: 4 }}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Creator Economy
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Earn from your creations with our blockchain-powered marketplace. Sell games, assets, and experiences.
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {["NFT Integration", "Royalty System", "Cross-Game Assets", "Developer Analytics"].map((feature) => (
                  <Grid item xs={6} key={feature}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Feature
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {feature}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Button 
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(90deg, #4D7CFF 0%, #8A4DFF 100%)',
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                Join Creator Program
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

const Web3Section = () => (
  <Box 
    component="section" 
    id="web3" 
    sx={{ 
      py: 10, 
      position: 'relative', 
      overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(5, 10, 24, 1) 0%, rgba(26, 32, 44, 0.5) 100%)',
    }}
  >
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
        Web3 Integration
      </Typography>
      <Typography variant="h6" sx={{ mb: 6, color: 'text.secondary' }}>
        True ownership in the virtual world
      </Typography>
      
      <Grid container spacing={4}>
        {[
          {
            title: "Digital Ownership",
            description: "Own your game assets as NFTs that can be traded, sold or used across multiple games",
            icon: "🌐"
          },
          {
            title: "Blockchain Gaming",
            description: "Experience transparent gameplay with verifiable random outcomes and secure transactions",
            icon: "⛓️"
          },
          {
            title: "Play to Earn",
            description: "Earn rewards through gameplay that have real-world value on our marketplace",
            icon: "💰"
          }
        ].map((card) => (
          <Grid item xs={12} md={6} lg={4} key={card.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  '& .card-title': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>{card.icon}</Typography>
                <Typography 
                  variant="h5" 
                  className="card-title"
                  sx={{ mb: 1, fontWeight: 700, transition: 'color 0.3s' }}
                >
                  {card.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Card sx={{ mt: 8, bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                Connect Your Wallet
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Link your Web3 wallet to start collecting, trading, and earning in the TheVirtuWorld ecosystem.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" flexWrap="wrap" gap={2} justifyContent="center">
                {["MetaMask", "Coinbase", "WalletConnect", "Phantom"].map((wallet) => (
                  <Button 
                    key={wallet}
                    variant="outlined"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.02)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    {wallet}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  </Box>
);

const Footer = () => (
  <Box 
    component="footer" 
    sx={{ 
      borderTop: 1, 
      borderColor: 'rgba(255, 255, 255, 0.1)', 
      py: 10 
    }}
  >
    <Container maxWidth="xl">
      <Grid container spacing={6} sx={{ mb: 6 }}>
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              TheVirtuWorld
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            The ultimate gaming metaverse powered by Web3 technology.
          </Typography>
        </Grid>
        
        {["Platform", "Resources", "Company"].map((section) => (
          <Grid item xs={12} sm={4} md={3} key={section}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
              {section}
            </Typography>
            <List sx={{ p: 0 }}>
              {["Games", "Creators", "Marketplace", "Support"].map((link) => (
                <ListItem key={link} sx={{ px: 0, py: 0.5 }}>
                  <Link href="#" style={{ textDecoration: 'none' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'text.primary',
                        },
                        transition: 'color 0.3s',
                      }}
                    >
                      {link}
                    </Typography>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        justifyContent="space-between" 
        alignItems="center"
        spacing={2}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          © 2023 TheVirtuWorld. All rights reserved.
        </Typography>
        <Stack direction="row" spacing={3}>
          {["Twitter", "Discord", "GitHub", "Medium"].map((social) => (
            <Link key={social} href="#" style={{ textDecoration: 'none' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  transition: 'color 0.3s',
                }}
              >
                {social}
              </Typography>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default function PageClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ pt: 8 }}>
          <HeroSection />
          <FeaturedGames />
          <Metaverse />
          <CreatorSection />
          <Web3Section />
          <Footer />
        </Box>
      </Box>
    </>
  );
}