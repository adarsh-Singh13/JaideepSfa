import * as React from 'react';
export const NavigationRef = React.createRef();
import { StackActions, CommonActions } from '@react-navigation/native';

function navigate(name, params) {
    if (NavigationRef.current) {
        NavigationRef.current.navigate(name, params);
    }
}

function nestedNavigate(root, child, params) {
    if (NavigationRef.current) {
        NavigationRef.current.navigate(root, { screen: child, params: params });
    }
}

function goBack() {
    if (NavigationRef.current) {
        NavigationRef.current.goBack();
    }
}

function pop(count) {
    if (NavigationRef.current) {
        NavigationRef.current.dispatch(StackActions.pop(count));
    }
}

function popToTop() {
    if (NavigationRef.current) {
        NavigationRef.current.dispatch(StackActions.popToTop());
    }
}

function resetRoot(rootName) {
    if (NavigationRef.current) {
        NavigationRef.current.resetRoot({
            index: 0,
            routes: [{ name: rootName }],
        });
    }
}

function push(...args) {
    if (NavigationRef.current) {
        NavigationRef.current.dispatch(StackActions.push(...args));
    }
};

function replace(name, params) {
    if (NavigationRef.current) {
        NavigationRef.current.dispatch(StackActions.replace(name, params));
    }
};

function resetToLogin() {
    if (NavigationRef.current) {
      NavigationRef.current.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    }
  }
   
export default {
    navigate,
    nestedNavigate,
    goBack,
    pop,
    popToTop,
    resetRoot,
    push,
    replace,
    resetToLogin,
}