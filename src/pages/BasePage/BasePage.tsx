import Header from '../../components/Header/Header';
import { BasePageContainer, ContentWrapper, TestnetInfo, TestnetMinor, TestnetHeader, TestnetHeaderInfo, TestnetHeaderGuide } from './BasePageStyles';
import InfoBar from '../../components/BasePageComponents/InfoBar/InfoBar';
import Supplies from './Assets/Supplies';
import Borrows from './Assets/Borrows';
import Footer from '../../components/Footer/Footer';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { useWallet, Action } from '@/store/wallet';
import { notification } from 'antd';
import { Address } from 'ton'
import ExclamationCircleIcon from '@heroicons/react/20/solid/ExclamationCircleIcon';
import RocketLaunchIcon from '@heroicons/react/20/solid/RocketLaunchIcon';




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
  .ant-tabs-nav {
    position: unset;
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
  const [ tab, setTab ] = useState('1');
  const isMobile = window.innerWidth < 480;
  const { wallet } = useWallet();


  const getTokens = () => {
    fetch('https://evaa-testnet-faucet.herokuapp.com/api/v1/feed', {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            address: Address.parseRaw(wallet?.account.address ?? "").toString()
        })
    }).then(e => e.json()).then(e => (JSON.stringify(e) === `{"status":"denied"}`) ? notification.open({
        message: 'You has already collected testnet tokens. You are only allowed to do this once.',
        icon: <ExclamationCircleIcon color='red' width='32px' height='32px' />,
    }) : notification.open({
        message: 'You used the tokens faucet.',
        description: 'The action will take some time to process, please do not worry',
        icon: <RocketLaunchIcon color='#0381C5' width='32px' height='32px' />,
    }))
}


  return (
    <BasePageContainer>
        <TestnetHeader>
          <TestnetHeaderInfo onClick={getTokens}>JOIN TEST NET - GET AIRDROP</TestnetHeaderInfo>
          <TestnetHeaderGuide onClick={() => window.open("https://t.me/evaaprotocol/26")}>Guide</TestnetHeaderGuide>
        </TestnetHeader>
        <Header />
        <InfoBar />
        <StyledTabs centered={isMobile} defaultActiveKey="1" items={isMobile ? mobileItems : items} onChange={setTab} />
        {!isMobile && 
          <ContentWrapper>
              <Supplies tab={tab}/>
              <Borrows tab={tab}/>
          </ContentWrapper>
        }

        {isMobile && tab === '1' &&
          <Supplies tab={'1'}/>
        }
        {isMobile && tab === '2' &&
          <Borrows tab={'1'}/>
        }
        <Footer />
    </BasePageContainer>
  )
}

export default BasePage;