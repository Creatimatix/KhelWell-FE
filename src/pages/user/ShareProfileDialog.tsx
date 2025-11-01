import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  QrCode as QrCodeIcon,
  Share as ShareIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import  toast from 'react-hot-toast';

interface ShareProfileDialogProps {
  open: boolean;
  onClose: () => void;
  profileUrl: string;
  userName: string;
}

export function ShareProfileDialog({ open, onClose, profileUrl, userName }: ShareProfileDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or restricted contexts
        const textArea = document.createElement('textarea');
        textArea.value = profileUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.error('Failed to copy link. Please copy manually.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      // If all else fails, select the text for manual copy
      toast.error('Please copy the link manually');
    }
  };

  const handleShare = (platform: string) => {
    const text = `Check out ${userName}'s sports profile!`;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + profileUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(profileUrl)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    { id: 'twitter', name: 'Twitter', icon: <TwitterIcon />, color: '#1DA1F2' },
    { id: 'facebook', name: 'Facebook', icon: <FacebookIcon />, color: '#4267B2' },
    { id: 'whatsapp', name: 'WhatsApp', icon: <WhatsAppIcon />, color: '#25D366' },
    { id: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
    { id: 'email', name: 'Email', icon: <EmailIcon />, color: '#EA4335' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShareIcon />
          Share Profile
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Copy Link Section */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Profile Link
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                gap: 1,
                bgcolor: 'action.hover',
              }}
            >
              <TextField
                fullWidth
                value={profileUrl}
                variant="standard"
                InputProps={{
                  readOnly: true,
                  disableUnderline: true,
                  sx: { fontSize: '0.875rem' },
                }}
              />
              <IconButton
                color={copied ? 'success' : 'primary'}
                onClick={handleCopyLink}
                sx={{ flexShrink: 0 }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </IconButton>
            </Paper>
          </Box>

          <Divider>
            <Typography variant="caption" color="text.secondary">
              Share via
            </Typography>
          </Divider>

          {/* Social Share Options */}
          <List sx={{ py: 0 }}>
            {shareOptions.map((option) => (
              <ListItemButton
                key={option.id}
                onClick={() => handleShare(option.id)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: option.color,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {option.icon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={option.name}
                  secondary={`Share on ${option.name}`}
                />
              </ListItemButton>
            ))}
          </List>

          {/* QR Code Info */}
          <Paper
            sx={{
              p: 2,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <QrCodeIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                QR Code Available
              </Typography>
              <Typography variant="caption">
                Generate a QR code for easy offline sharing
              </Typography>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleCopyLink} startIcon={<CopyIcon />}>
          Copy Link
        </Button>
      </DialogActions>
    </Dialog>
  );
}
