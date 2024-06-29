import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

export const EventInvitation = ({
    eventName,
    eventDate,
    eventVenue,
    recipientName,
    isRegistered,
    registrationUrl,
}) => (
    <Html>
        <Head />
        <Preview>You are invited to {eventName}! 🎉</Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src="/logo.svg"
                    width="170"
                    height="50"
                    alt="Your App Logo"
                    style={logo}
                />
                <Heading style={h1}>You are Invited! 🎊</Heading>
                <Text style={text}>
                    Hello {recipientName},
                </Text>
                <Text style={text}>
                    You have been invited to an exciting event! 🥳
                </Text>
                <Section style={buttonContainer}>
                    <Button
                        href={`https://giftify-eta.vercel.app/`}
                        style={button}
                    >
                        View Event Details
                    </Button>
                </Section>
                <Text style={text}>
                    <strong>Event: </strong> {eventName} 🎭<br />
                    <strong>Date: </strong> {eventDate} 📅<br />
                    <strong>Venue: </strong> {eventVenue} 📍
                </Text>
                <Hr style={hr} />
                {!isRegistered && (
                    <>
                        <Text style={text}>
                            To RSVP and see more details, please register for our platform:
                        </Text>
                        <Section style={buttonContainer}>
                            <Button
                                href={registrationUrl}
                                style={button}
                            >
                                Register Now
                            </Button>
                        </Section>
                    </>
                )}
                <Text style={footer}>
                    We are excited to see you there! 🎈
                </Text>
            </Container>
        </Body>
    </Html>
);


const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
};

const logo = {
    margin: '0 auto',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '30px 0',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
};

const buttonContainer = {
    textAlign: 'center',
};

const button = {
    backgroundColor: '#5F51E8',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    width: '200px',
    padding: '12px',
};

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
};

export default EventInvitation;