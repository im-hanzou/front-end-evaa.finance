import Header from '../../components/Header/Header';
import { BasePageContainer, ContentWrapper, TestnetInfo, TestnetMinor } from './BasePageStyles';
import InfoBar from '../../components/BasePageComponents/InfoBar/InfoBar';
import Supplies from './Assets/Supplies';
import Borrows from './Assets/Borrows';
import Footer from '../../components/Footer/Footer';
import { Tabs, Button } from 'antd';
import type { TabsProps } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { BoldRobotoText } from '../../components/Texts/MainTexts';
import { useWallet, Action } from '@/store/wallet';
import { Address } from "ton"
const StyledTabs = styled(Tabs)`
  width: 90%;
  color: #767B7DD9;
  margin-bottom: 2rem;

  .ant-tabs-tab-btn {
    font-size: 2.2rem;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #fff;
  }

  .ant-tabs-ink-bar {
    background: #0381C5;
  }

  .ant-tabs-tab:hover {
    color: #0381C5;
  }
`

const Container = styled.div`
  margin-bottom: 500px;
  margin-top: 50px;
  color: white;
  > * {
    color: white;
  }
`


const items: TabsProps['items'] = [
  {
    key: '1',
    label: `Main Pool`,
  },
  {
    key: '2',
    label: `Ecosystem Pool`,
  },
];


const mobileItems: TabsProps['items'] = [
  {
    key: '1',
    label: `Supply`,
  },
  {
    key: '2',
    label: `Borrow`,
  },
];


const BasePage = () => {
  const [tab, setTab] = useState('1');
  const isMobile = window.innerWidth < 480;
  const { wallet } = useWallet();
  const getTokens = () => {
    console.log()
    fetch('http://evaa-testnet-faucet.herokuapp.com/api/v1/feed', {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: Address.parseRaw(wallet?.account.address ?? "").toString()
      })
    }).then(e => e.json()).then(e => alert(JSON.stringify(e)))
  }
  return (
    <BasePageContainer>
      <TestnetInfo><TestnetMinor>Configure your wallet for use with the</TestnetMinor> TESTNET</TestnetInfo>
      <Header />
      <Container >
        <Button onClick={getTokens}>Get tokens</Button>
      </Container >
      <Footer />
    </BasePageContainer>
  )
}

export default BasePage;
