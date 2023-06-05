import Header from '../../components/Header/Header';
import { BasePageContainer, ContentWrapper, TestnetInfo, TestnetMinor } from './BasePageStyles';
import InfoBar from '../../components/BasePageComponents/InfoBar/InfoBar';
import Supplies from './Assets/Supplies';
import Borrows from './Assets/Borrows';
import Footer from '../../components/Footer/Footer';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { BoldRobotoText } from '../../components/Texts/MainTexts';


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

  return (
    <BasePageContainer>
        <TestnetInfo><TestnetMinor>Configure your wallet for use with the</TestnetMinor> TESTNET</TestnetInfo>
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