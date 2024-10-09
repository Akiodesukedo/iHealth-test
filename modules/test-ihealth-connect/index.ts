import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to TestIhealthConnect.web.ts
// and on native platforms to TestIhealthConnect.ts
import TestIhealthConnectModule from './src/TestIhealthConnectModule';
import { ChangeEventPayload, TestIhealthConnectViewProps } from './src/TestIhealthConnect.types';

// Get the native constant value.
export const PI = TestIhealthConnectModule.PI;

export function hello(): string {
  return TestIhealthConnectModule.hello();
}

export async function setValueAsync(value: string) {
  return await TestIhealthConnectModule.setValueAsync(value);
}

const emitter = new EventEmitter(TestIhealthConnectModule ?? NativeModulesProxy.TestIhealthConnect);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

