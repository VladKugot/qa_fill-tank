'use strict';

describe('fillTank', () => {
  const { fillTank } = require('./fillTank');

  it('should fill full tank when amount is not given', () => {
    const customer = {
      money: 3000,
      vehicle: {
        maxTankCapacity: 40,
        fuelRemains: 8,
      },
    };

    fillTank(customer, 50); // price per liter = 50
    // Tank capacity = 40, remains = 8 → can fit 32 liters
    expect(customer.vehicle.fuelRemains).toBe(40);
    expect(customer.money).toBe(3000 - 32 * 50);
  });

  it('should not overfill the tank when requested amount is too big', () => {
    const customer = {
      money: 5000,
      vehicle: {
        maxTankCapacity: 40,
        fuelRemains: 35,
      },
    };

    fillTank(customer, 100, 10); // wants 10 liters, but only 5 fit
    expect(customer.vehicle.fuelRemains).toBe(40);
    expect(customer.money).toBe(5000 - 5 * 100);
  });

  it('should fill only what the customer can pay for', () => {
    const customer = {
      money: 100, // can only afford 2 liters at 50/l
      vehicle: {
        maxTankCapacity: 50,
        fuelRemains: 8,
      },
    };

    fillTank(customer, 30, 20);
    expect(customer.vehicle.fuelRemains).toBe(11.3); // +2 liters
    expect(customer.money).toBe(0);
  });

  it('should round poured amount down to the nearest tenth', () => {
    const customer = {
      money: 1000,
      vehicle: {
        maxTankCapacity: 50,
        fuelRemains: 8,
      },
    };

    fillTank(customer, 33, 30);
    // price = 33/l, money = 1000 → can buy 30.3 liters max
    // But requested 30 liters → 30 exactly, no rounding
    expect(customer.vehicle.fuelRemains).toBe(38);
  });

  it('should not fill if poured amount is less than 2 liters', () => {
    const customer = {
      money: 50,
      vehicle: {
        maxTankCapacity: 40,
        fuelRemains: 8,
      },
    };

    fillTank(customer, 30, 10); // can afford 1.6 liters
    expect(customer.vehicle.fuelRemains).toBe(8); // no change
    expect(customer.money).toBe(50); // no change
  });

  it('should round total fuel price to nearest hundredth', () => {
    const customer = {
      money: 3000,
      vehicle: {
        maxTankCapacity: 40,
        fuelRemains: 8,
      },
    };

    fillTank(customer, 33.333, 5); // 5 liters * 33.333 = 166.665 → 166.67
    expect(customer.money).toBeCloseTo(3000 - 166.67, 2);
    expect(customer.vehicle.fuelRemains).toBe(13);
  });
});
