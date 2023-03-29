import styled from 'styled-components';

const FooterWrapper = styled.div`
    margin-top: 3.5rem;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 5rem;
    text-align: center;
`
const FooterLink = styled.a`
    color: #0381C5;
    font-size: 1.8rem;
    margin-left: .5rem;
`


const Footer = () => {    
    return (
        <FooterWrapper>
            TWA version: <FooterLink href="https://t.me/EvaaAppBot" target="_blank">@EvaaAppBot</FooterLink>
            <br/>
            Need help? <FooterLink href="https://t.me/alexuniverse12" target="_blank">t.me/alexuniverse12</FooterLink>
        </FooterWrapper>
    )
}

export default Footer;